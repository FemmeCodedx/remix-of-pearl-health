import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBasket, Trash2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSwanCopy } from "@/lib/i18nSwan";
import UpgradeGate from "@/components/UpgradeGate";
import { useRubyAi } from "@/hooks/useRubyAi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Source = "manual" | "meal_plan" | "recipe_list";

interface AisleItem {
  name: string;
  qty?: string;
}
interface GroceryList {
  aisles: { name: string; items: AisleItem[] }[];
}
interface SavedList {
  id: string;
  title: string;
  source: string;
  items_json: GroceryList;
  created_at: string;
}

const AiGroceryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const c = useSwanCopy();
  const { invoke, loading } = useRubyAi<{
    list: GroceryList;
    title: string;
    quotaRemaining: number;
  }>();

  const [source, setSource] = useState<Source>("manual");
  const [sourceId, setSourceId] = useState<string>("");
  const [manualText, setManualText] = useState("");
  const [list, setList] = useState<GroceryList | null>(null);
  const [quota, setQuota] = useState<number | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<SavedList[]>([]);
  const [mealPlans, setMealPlans] = useState<{ id: string; title: string }[]>([]);
  const [recipeLists, setRecipeLists] = useState<{ id: string; name: string }[]>([]);

  const refresh = async () => {
    if (!user) return;
    const [{ data: lists }, { data: mp }, { data: rl }] = await Promise.all([
      supabase
        .from("ai_grocery_lists")
        .select("id, title, source, items_json, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("ai_meal_plans")
        .select("id, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("recipe_lists")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    setSaved(((lists ?? []) as unknown) as SavedList[]);
    setMealPlans(mp ?? []);
    setRecipeLists(rl ?? []);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const generate = async () => {
    const body: Record<string, unknown> = { source };
    if (source === "manual") {
      body.items = manualText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      if ((body.items as string[]).length === 0) {
        toast({ title: c.required, variant: "destructive" });
        return;
      }
    } else {
      if (!sourceId) {
        toast({ title: c.ruby.grocery.pickSource, variant: "destructive" });
        return;
      }
      body.source_id = sourceId;
    }
    const res = await invoke("ai-grocery-list", body);
    if (res?.list) {
      setList(res.list);
      setQuota(res.quotaRemaining);
      setChecked(new Set());
      refresh();
    }
  };

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const copyList = async () => {
    if (!list) return;
    const text = list.aisles
      .map(
        (a) =>
          `${a.name}\n` +
          a.items.map((i) => `  - ${i.name}${i.qty ? ` (${i.qty})` : ""}`).join("\n"),
      )
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    toast({ title: c.ruby.grocery.copied });
  };

  const deleteList = async (id: string) => {
    await supabase.from("ai_grocery_lists").delete().eq("id", id);
    refresh();
  };

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label={c.back}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <ShoppingBasket className="w-5 h-5 text-destructive" />
            {c.ruby.grocery.title}
          </h1>
          <p className="text-xs text-muted-foreground font-body">{c.ruby.grocery.subtitle}</p>
        </div>
      </div>

      <UpgradeGate required="ruby" featureName={c.ruby.grocery.title} description={c.ruby.grocery.subtitle}>
        <div className="mb-4 p-4 rounded-2xl bg-card shadow-card space-y-3">
          <div>
            <label className="text-xs font-body text-muted-foreground mb-1 block">{c.ruby.grocery.sourceLabel}</label>
            <div className="flex gap-2">
              {([
                ["manual", c.ruby.grocery.manual],
                ["meal_plan", c.ruby.grocery.fromMeal],
                ["recipe_list", c.ruby.grocery.fromRecipes],
              ] as [Source, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSource(key);
                    setSourceId("");
                  }}
                  className={`flex-1 px-2 py-2 rounded-xl text-xs font-body font-semibold transition-colors ${
                    source === key
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {source === "manual" ? (
            <Textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={c.ruby.grocery.manualPh}
              rows={5}
              className="rounded-xl"
            />
          ) : (
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full p-2 rounded-xl border border-border bg-background text-sm font-body"
            >
              <option value="">{c.ruby.grocery.pickSource}</option>
              {(source === "meal_plan" ? mealPlans : recipeLists).map((item) => (
                <option key={item.id} value={item.id}>
                  {"title" in item ? item.title : item.name}
                </option>
              ))}
            </select>
          )}

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? c.loading : c.ruby.grocery.generate}
          </Button>
          {quota !== null && (
            <p className="text-xs text-muted-foreground text-center">
              {c.ruby.mealPlan.quotaLeft.replace("{n}", String(quota))}
            </p>
          )}
        </div>

        {loading && !list && <Skeleton className="h-40 w-full rounded-2xl mb-4" />}

        {list && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-card shadow-card"
          >
            <div className="flex justify-end mb-2">
              <Button onClick={copyList} variant="outline" size="sm" className="rounded-lg">
                <Copy className="w-3.5 h-3.5 mr-1" /> {c.ruby.grocery.copy}
              </Button>
            </div>
            {list.aisles.map((aisle, ai) => (
              <div key={ai} className="mb-3 last:mb-0">
                <h3 className="font-display font-semibold text-sm text-foreground mb-1">{aisle.name}</h3>
                <ul className="space-y-1">
                  {aisle.items.map((item, ii) => {
                    const key = `${ai}-${ii}`;
                    const isChecked = checked.has(key);
                    return (
                      <li key={key}>
                        <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(key)}
                            className="rounded"
                          />
                          <span className={isChecked ? "line-through text-muted-foreground" : "text-foreground"}>
                            {item.name}
                            {item.qty && <span className="text-muted-foreground ml-1">({item.qty})</span>}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </motion.div>
        )}

        <h2 className="font-display text-lg font-semibold mb-2 mt-4">{c.ruby.grocery.savedLists}</h2>
        {saved.length === 0 ? (
          <p className="text-sm text-muted-foreground font-body">{c.ruby.grocery.empty}</p>
        ) : (
          <ul className="space-y-2">
            {saved.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-card shadow-card"
              >
                <button
                  onClick={() => {
                    setList(s.items_json);
                    setChecked(new Set());
                  }}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-body font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </button>
                <button
                  onClick={() => deleteList(s.id)}
                  aria-label={c.delete}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </UpgradeGate>
    </div>
  );
};

export default AiGroceryPage;
