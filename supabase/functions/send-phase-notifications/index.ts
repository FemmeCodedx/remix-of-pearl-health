// Sends cycle-phase push notifications to users whose phase changed today.
// Triggered by a daily pg_cron job. Uses VAPID web push.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import webpush from "https://esm.sh/web-push@3.6.7?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

const PHASE_COPY: Record<string, Record<Phase, { title: string; body: string }>> = {
  en: {
    menstrual: {
      title: "Your menstrual phase has begun 🌸",
      body: "Rest, warmth, and gentle movement. Iron-rich foods support your energy.",
    },
    follicular: {
      title: "Welcome to your follicular phase ✨",
      body: "Energy is rising — a great time for new workouts, ideas, and connection.",
    },
    ovulation: {
      title: "You're in your ovulation phase 💛",
      body: "Peak energy and confidence. Light cardio and social plans align well today.",
    },
    luteal: {
      title: "Entering your luteal phase 🌙",
      body: "Slow down, prep meals, and protect sleep. Magnesium-rich foods help mood.",
    },
  },
  es: {
    menstrual: {
      title: "Empieza tu fase menstrual 🌸",
      body: "Descanso, calor y movimiento suave. Alimentos ricos en hierro te dan energía.",
    },
    follicular: {
      title: "Bienvenida a tu fase folicular ✨",
      body: "Sube tu energía — buen momento para nuevos entrenamientos e ideas.",
    },
    ovulation: {
      title: "Estás en tu fase de ovulación 💛",
      body: "Energía y confianza al máximo. Cardio ligero y planes sociales hoy.",
    },
    luteal: {
      title: "Entras en tu fase lútea 🌙",
      body: "Baja el ritmo, prepara comidas y protege el sueño. El magnesio ayuda al ánimo.",
    },
  },
};

const FRIEND_COPY: Record<Phase, (name: string) => { title: string; body: string }> = {
  menstrual: (n) => ({
    title: `${n} just started their menstrual phase 🌸`,
    body: "A great time to send love, warmth, or a cozy check-in.",
  }),
  follicular: (n) => ({
    title: `${n} is in their follicular phase ✨`,
    body: "Energy is rising — perfect for shared workouts or new plans together.",
  }),
  ovulation: (n) => ({
    title: `${n} is in their ovulation phase 💛`,
    body: "Peak energy and confidence — a great day to make plans.",
  }),
  luteal: (n) => ({
    title: `${n} entered their luteal phase 🌙`,
    body: "Slower energy ahead. A kind word or gentle plan goes a long way.",
  }),
};

function computePhase(
  lastPeriod: string,
  cycleLen: number,
  periodLen: number,
  on: Date,
): Phase {
  const start = new Date(lastPeriod + "T00:00:00Z");
  const day = Math.floor((on.getTime() - start.getTime()) / 86400000);
  const cycleDay = ((day % cycleLen) + cycleLen) % cycleLen + 1; // 1..cycleLen
  const ovStart = Math.max(1, Math.floor(cycleLen / 2) - 1);
  const ovEnd = ovStart + 2;
  if (cycleDay <= periodLen) return "menstrual";
  if (cycleDay < ovStart) return "follicular";
  if (cycleDay <= ovEnd) return "ovulation";
  return "luteal";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const vapidPub = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPriv = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidSub = Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@example.com";
    if (!vapidPub || !vapidPriv) {
      return new Response(
        JSON.stringify({ error: "VAPID keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    webpush.setVapidDetails(vapidSub, vapidPub, vapidPriv);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);

    const { data: profiles, error: pErr } = await admin
      .from("profiles")
      .select("id, last_period_date, avg_cycle_length, avg_period_length, notif_phase_change")
      .eq("notif_phase_change", true)
      .not("last_period_date", "is", null);
    if (pErr) throw pErr;

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const p of profiles ?? []) {
      const cyc = p.avg_cycle_length ?? 28;
      const per = p.avg_period_length ?? 5;
      if (!p.last_period_date) continue;

      const phaseToday = computePhase(p.last_period_date, cyc, per, today);
      const phaseYesterday = computePhase(p.last_period_date, cyc, per, yesterday);
      if (phaseToday === phaseYesterday) {
        skipped++;
        continue;
      }

      // Dedupe — already sent for this phase in last 20h?
      const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();
      const { data: recent } = await admin
        .from("notification_log")
        .select("id")
        .eq("user_id", p.id)
        .eq("kind", "phase_change")
        .eq("phase", phaseToday)
        .gte("sent_at", cutoff)
        .limit(1);
      if (recent && recent.length > 0) {
        skipped++;
        continue;
      }

      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("id, endpoint, p256dh, auth")
        .eq("user_id", p.id);
      if (!subs || subs.length === 0) continue;

      const copy = PHASE_COPY.en[phaseToday];
      const payload = JSON.stringify({
        title: copy.title,
        body: copy.body,
        url: "/",
        tag: `phase-${phaseToday}`,
      });

      let anySuccess = false;
      for (const s of subs) {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
          );
          anySuccess = true;
        } catch (err: any) {
          const status = err?.statusCode;
          if (status === 404 || status === 410) {
            await admin.from("push_subscriptions").delete().eq("id", s.id);
          } else {
            errors.push(`${p.id}: ${String(err?.message ?? err)}`);
          }
        }
      }

      if (anySuccess) {
        await admin.from("notification_log").insert({
          user_id: p.id,
          kind: "phase_change",
          phase: phaseToday,
          success: true,
        });
        sent++;
      }
    }

    return new Response(
      JSON.stringify({ sent, skipped, errorsSample: errors.slice(0, 5) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
