// Shared guard for Ruby AI features:
// - validates JWT
// - confirms the user has an active Ruby subscription
// - enforces a per-feature daily cap
// Returns user-scoped + service-role Supabase clients for the function to use.

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export type GuardResult = {
  userId: string;
  userClient: SupabaseClient;
  serviceClient: SupabaseClient;
  usedToday: number;
  cap: number;
  recordUsage: (result?: unknown) => Promise<void>;
};

export type GuardFailure = { error: string; status: number };

export async function rubyGuard(
  req: Request,
  feature: string,
  cap: number,
): Promise<GuardResult | GuardFailure> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const serviceClient = createClient(supabaseUrl, serviceKey);

  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claims?.claims?.sub) {
    return { error: "Unauthorized", status: 401 };
  }
  const userId = claims.claims.sub as string;

  // Verify Ruby tier — most recent paid subscription in either env.
  const { data: sub } = await userClient
    .from("subscriptions")
    .select("tier, status, current_period_end")
    .eq("user_id", userId)
    .not("paddle_subscription_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isRuby =
    sub?.tier === "ruby" &&
    (sub.status === "active" || sub.status === "trialing" || sub.status === "past_due") &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());

  if (!isRuby) {
    return { error: "Ruby subscription required", status: 403 };
  }

  // Daily cap check (UTC date).
  const today = new Date().toISOString().slice(0, 10);
  const { count } = await serviceClient
    .from("ai_usage_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .eq("used_on", today);

  const usedToday = count ?? 0;
  if (usedToday >= cap) {
    return { error: `Daily limit reached (${cap}). Try again tomorrow.`, status: 429 };
  }

  return {
    userId,
    userClient,
    serviceClient,
    usedToday,
    cap,
    recordUsage: async (result?: unknown) => {
      await serviceClient.from("ai_usage_log").insert({
        user_id: userId,
        feature,
        used_on: today,
        result_json: result ?? null,
      });
    },
  };
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
