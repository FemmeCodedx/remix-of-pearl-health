// Generate a 7-day meal plan tailored to the user's cycle phase + profile.
// Returns structured JSON: { days: [{ day, breakfast, lunch, dinner, snack, notes }] }

import { corsHeaders, jsonResponse, rubyGuard } from "../_shared/ruby-guard.ts";
import { callAiJson, type AiError } from "../_shared/lovable-ai.ts";

const FEATURE = "meal_plan";
const CAP = 3;

type Meal = { breakfast: string; lunch: string; dinner: string; snack: string };
type Day = { day: string } & Meal & { notes?: string };
type MealPlan = { phase: string; summary: string; days: Day[] };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const guard = await rubyGuard(req, FEATURE, CAP);
  if ("error" in guard) return jsonResponse({ error: guard.error }, guard.status);

  try {
    const body = await req.json().catch(() => ({}));
    const phase = ["menstrual", "follicular", "ovulation", "luteal"].includes(body?.phase)
      ? body.phase as string
      : "follicular";
    const dietary = String(body?.dietary_prefs ?? "").slice(0, 200);
    const save = !!body?.save;

    const { data: profile } = await guard.userClient
      .from("profiles")
      .select("goals, health_focus, physical_conditions, mental_conditions")
      .eq("id", guard.userId)
      .maybeSingle();

    const goals = (profile?.goals ?? []).join(", ") || "balanced energy";
    const focus = (profile?.health_focus ?? []).join(", ") || "general wellness";
    const conditions = [
      ...(profile?.physical_conditions ?? []),
      ...(profile?.mental_conditions ?? []),
    ].join(", ") || "none";

    const plan = await callAiJson<MealPlan>({
      system:
        "You are a culinary nutritionist for Pearl Femme, a menstrual cycle wellness app. " +
        "Create a 7-day meal plan tailored to the user's current cycle phase. " +
        "Use whole foods, phase-appropriate ingredients (e.g. iron-rich for menstrual, light & fresh for follicular, " +
        "anti-inflammatory for ovulation, magnesium & complex carbs for luteal). " +
        "Keep meals practical (≤30 min prep). Never give medical advice. " +
        "Respond ONLY with valid JSON matching the schema.",
      schemaHint:
        `Output JSON shape: { "phase": "<phase>", "summary": "<one sentence overview>", ` +
        `"days": [ { "day": "Monday", "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "...", "notes": "<optional 1-line tip>" }, ... 7 entries ... ] }`,
      prompt:
        `Cycle phase: ${phase}\n` +
        `Goals: ${goals}\n` +
        `Health focus: ${focus}\n` +
        `Conditions to consider: ${conditions}\n` +
        `Dietary preferences/restrictions: ${dietary || "none specified"}\n\n` +
        `Generate the 7-day plan now.`,
    });

    if (!plan?.days || !Array.isArray(plan.days) || plan.days.length === 0) {
      return jsonResponse({ error: "AI returned malformed plan" }, 502);
    }

    let savedId: string | null = null;
    if (save) {
      const { data: row } = await guard.userClient
        .from("ai_meal_plans")
        .insert({
          user_id: guard.userId,
          phase,
          title: `${phase.charAt(0).toUpperCase()}${phase.slice(1)} meal plan`,
          plan_json: plan,
        })
        .select("id")
        .single();
      savedId = row?.id ?? null;
    }

    await guard.recordUsage({ phase });
    return jsonResponse({
      plan,
      savedId,
      quotaRemaining: Math.max(0, CAP - guard.usedToday - 1),
    });
  } catch (e) {
    const err = e as AiError;
    return jsonResponse({ error: err.message ?? String(e) }, err.status ?? 500);
  }
});
