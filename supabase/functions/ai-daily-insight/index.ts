// Daily AI insight for Ruby users. Idempotent per UTC day — first call generates,
// subsequent calls return the cached result_json.

import { corsHeaders, jsonResponse, rubyGuard } from "../_shared/ruby-guard.ts";
import { callAiText, type AiError } from "../_shared/lovable-ai.ts";

const FEATURE = "daily_insight";
const CAP = 1;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const guard = await rubyGuard(req, FEATURE, CAP);
  if ("error" in guard) {
    // 429 from cap means "already generated today" — return today's cached result instead of erroring.
    if (guard.status === 429) {
      const today = new Date().toISOString().slice(0, 10);
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const { createClient } = await import("npm:@supabase/supabase-js@2");
      const svc = createClient(supabaseUrl, serviceKey);
      const authHeader = req.headers.get("Authorization")!;
      const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anon, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: claims } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
      const userId = claims?.claims?.sub as string | undefined;
      if (userId) {
        const { data } = await svc
          .from("ai_usage_log")
          .select("result_json")
          .eq("user_id", userId)
          .eq("feature", FEATURE)
          .eq("used_on", today)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.result_json) return jsonResponse({ insight: data.result_json, cached: true });
      }
    }
    return jsonResponse({ error: guard.error }, guard.status);
  }

  try {
    // Pull profile + recent symptoms.
    const [{ data: profile }, { data: symptoms }, { data: cycle }] = await Promise.all([
      guard.userClient
        .from("profiles")
        .select("display_name, goals, health_focus, age_group, avg_cycle_length, last_period_date")
        .eq("id", guard.userId)
        .maybeSingle(),
      guard.userClient
        .from("symptom_logs")
        .select("symptom_key, intensity, logged_on")
        .eq("user_id", guard.userId)
        .gte("logged_on", new Date(Date.now() - 14 * 86400_000).toISOString().slice(0, 10))
        .order("logged_on", { ascending: false }),
      guard.userClient
        .from("cycle_logs")
        .select("started_on, ended_on")
        .eq("user_id", guard.userId)
        .order("started_on", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // Estimate current phase from last period + avg cycle.
    let phase = "follicular";
    if (cycle?.started_on) {
      const days = Math.floor(
        (Date.now() - new Date(cycle.started_on).getTime()) / 86400_000,
      );
      const cycleLen = profile?.avg_cycle_length ?? 28;
      const dayInCycle = ((days % cycleLen) + cycleLen) % cycleLen;
      if (dayInCycle < 5) phase = "menstrual";
      else if (dayInCycle < 13) phase = "follicular";
      else if (dayInCycle < 17) phase = "ovulation";
      else phase = "luteal";
    }

    const symptomSummary = (symptoms ?? [])
      .slice(0, 20)
      .map((s) => `${s.symptom_key} (${s.intensity}/3) on ${s.logged_on}`)
      .join("; ") || "no symptoms logged";

    const goals = (profile?.goals ?? []).join(", ") || "general wellness";
    const focus = (profile?.health_focus ?? []).join(", ") || "balance";

    const text = await callAiText({
      system:
        "You are a warm wellness companion for a menstrual cycle app called Pearl Femme. " +
        "You give ONE short daily insight (max 80 words) tailored to the user's current cycle phase, " +
        "recent symptoms, and goals. Always include exactly one concrete, gentle suggestion. " +
        "Never give medical advice. Avoid prescribing or diagnosing. End with a single short actionable tip. " +
        "Respond in the same language as the user's locale (default English).",
      prompt:
        `Current phase: ${phase}\n` +
        `Recent symptoms (last 14 days): ${symptomSummary}\n` +
        `Goals: ${goals}\n` +
        `Health focus: ${focus}\n\n` +
        `Write today's gentle insight.`,
    });

    const insight = { phase, text: text.trim(), generated_at: new Date().toISOString() };
    await guard.recordUsage(insight);
    return jsonResponse({ insight, cached: false });
  } catch (e) {
    const err = e as AiError;
    return jsonResponse({ error: err.message ?? String(e) }, err.status ?? 500);
  }
});
