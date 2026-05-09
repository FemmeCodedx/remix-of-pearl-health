// Generate an aisle-grouped grocery list from a meal plan, recipe list, or raw items.

import { corsHeaders, jsonResponse, rubyGuard } from "../_shared/ruby-guard.ts";
import { callAiJson, type AiError } from "../_shared/lovable-ai.ts";

const FEATURE = "grocery_list";
const CAP = 10;

type GroceryList = {
  aisles: { name: string; items: { name: string; qty?: string }[] }[];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const guard = await rubyGuard(req, FEATURE, CAP);
  if ("error" in guard) return jsonResponse({ error: guard.error }, guard.status);

  try {
    const body = await req.json().catch(() => ({}));
    const source = String(body?.source ?? "manual");
    const sourceId = body?.source_id as string | undefined;
    const manualItems = Array.isArray(body?.items) ? body.items.slice(0, 200) : [];

    // Build the ingredient text payload depending on source.
    let ingredientsText = "";
    let title = "Grocery list";
    if (source === "meal_plan" && sourceId) {
      const { data: mp } = await guard.userClient
        .from("ai_meal_plans")
        .select("plan_json, title")
        .eq("id", sourceId)
        .eq("user_id", guard.userId)
        .maybeSingle();
      if (!mp) return jsonResponse({ error: "Meal plan not found" }, 404);
      title = `Groceries — ${mp.title}`;
      const days = (mp.plan_json as { days?: Array<Record<string, string>> })?.days ?? [];
      ingredientsText = days
        .map((d) => `${d.day}: ${d.breakfast}; ${d.lunch}; ${d.dinner}; ${d.snack}`)
        .join("\n");
    } else if (source === "recipe_list" && sourceId) {
      const { data: list } = await guard.userClient
        .from("recipe_lists")
        .select("name")
        .eq("id", sourceId)
        .eq("user_id", guard.userId)
        .maybeSingle();
      if (!list) return jsonResponse({ error: "Recipe list not found" }, 404);
      const { data: recipes } = await guard.userClient
        .from("recipes")
        .select("title, ingredients")
        .eq("list_id", sourceId)
        .eq("user_id", guard.userId);
      title = `Groceries — ${list.name}`;
      ingredientsText = (recipes ?? [])
        .map((r) => `${r.title}: ${(r.ingredients ?? []).join(", ")}`)
        .join("\n");
    } else if (manualItems.length > 0) {
      title = "Custom grocery list";
      ingredientsText = manualItems.join("\n");
    } else {
      return jsonResponse({ error: "No source or items provided" }, 400);
    }

    if (!ingredientsText.trim()) {
      return jsonResponse({ error: "No ingredients to process" }, 400);
    }

    const list = await callAiJson<GroceryList>({
      system:
        "You are a helpful grocery assistant. Convert the meals/recipes below into a consolidated " +
        "shopping list grouped by typical supermarket aisle. Combine duplicate ingredients with realistic quantities. " +
        "Use these aisle names: Produce, Proteins, Dairy & Eggs, Grains & Pantry, Frozen, Spices & Condiments, Other. " +
        "Skip pantry staples that most people already have (salt, pepper, water, oil) unless explicitly listed. " +
        "Respond ONLY with valid JSON matching the schema.",
      schemaHint:
        `Output JSON shape: { "aisles": [ { "name": "Produce", "items": [ { "name": "spinach", "qty": "1 bag" } ] } ] }`,
      prompt: `Source: ${source}\nIngredients/meals to process:\n${ingredientsText.slice(0, 4000)}`,
    });

    if (!list?.aisles?.length) {
      return jsonResponse({ error: "AI returned empty list" }, 502);
    }

    const { data: row } = await guard.userClient
      .from("ai_grocery_lists")
      .insert({
        user_id: guard.userId,
        source,
        source_id: sourceId ?? null,
        title,
        items_json: list,
      })
      .select("id")
      .single();

    await guard.recordUsage({ source });
    return jsonResponse({
      list,
      savedId: row?.id ?? null,
      title,
      quotaRemaining: Math.max(0, CAP - guard.usedToday - 1),
    });
  } catch (e) {
    const err = e as AiError;
    return jsonResponse({ error: err.message ?? String(e) }, err.status ?? 500);
  }
});
