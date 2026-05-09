import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Trash2, ShoppingBasket } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSwanCopy, type Phase } from "@/lib/i18nSwan";
import UpgradeGate from "@/components/UpgradeGate";
import { useRubyAi } from "@/hooks/useRubyAi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Day {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  notes?: string;
}
interface MealPlan {
  phase: string;
  summary: string;
  days: Day[];
}
interface SavedPlan {
  id: string;
  phase: Phase;
  title: string;
  plan_json: MealPlan;
  created_at: string;
}

const PHASES: Phase[] = ["menstrual", "follicular", "ovulation", "luteal"];

const AiMealsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const c = useSwanCopy();
  const { invoke, loading } = useRubyAi<{
    plan: MealPlan;
    savedId: string | null;
    quotaRemaining: number;
  }>();

  const [phase, setPhase] = useState<Phase>("follicular");
  const [dietary, setDietary] = useState("");
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [quota, setQuota] = useState<number | null>(null);
  const [saved, setSaved] = useState<SavedPlan[]>([]);

  const refreshSaved = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("ai_meal_plans")
      .select("id, phase, title, plan_json, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSaved((data as SavedPlan[]) ?? []);
  };

  useEffect(() => {
    refreshSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const generate = async (save = false) => {
    const res = await invoke("ai-meal-plan", { phase, dietary_prefs: dietary, save });
    if (res?.plan) {
      setPlan(res.plan);
      setQuota(res.quotaRemaining);
      if (save) {
        toast({ title: c.ruby.mealPlan.saved });
        refreshSaved();
      }
    }
  };

  const deletePlan = async (id: string) => {
    await supabase.from("ai_meal_plans").delete().eq("id", id);
    refreshSaved();
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
            <Sparkles className="w-5 h-5 text-destructive" />
            {c.ruby.mealPlan.title}
          </h1>
          <p className="text-xs text-muted-foreground font-body">{c.ruby.mealPlan.subtitle}</p>
        </div>
      </div>

      <UpgradeGate required="ruby" featureName={c.ruby.mealPlan.title} description={c.ruby.mealPlan.subtitle}>
        <div className="mb-4 p-4 rounded-2xl bg-card shadow-card space-y-3">
          <div>
            <label className="text-xs font-body text-muted-foreground mb-1 block">{c.recipes.phaseLabel}</label>
            <div className="flex flex-wrap gap-2">
              {PHASES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPhase(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                    phase === p ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {c.phases[p]}
                </button>
              ))}
            </div>
          </div>
          <Input
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder={c.ruby.mealPlan.dietaryPh}
            className="rounded-xl"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => generate(false)}
              disabled={loading}
              className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? c.loading : plan ? c.ruby.mealPlan.regenerate : c.ruby.mealPlan.generate}
            </Button>
            {plan && (
              <Button
                onClick={() => generate(true)}
                disabled={loading}
                variant="outline"
                className="rounded-xl"
              >
                {c.ruby.mealPlan.savePlan}
              </Button>
            )}
          </div>
          {quota !== null && (
            <p className="text-xs text-muted-foreground text-center">
              {c.ruby.mealPlan.quotaLeft.replace("{n}", String(quota))}
            </p>
          )}
        </div>

        {loading && !plan && <Skeleton className="h-40 w-full rounded-2xl mb-4" />}

        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mb-6"
          >
            {plan.summary && (
              <p className="text-sm font-body text-muted-foreground italic">{plan.summary}</p>
            )}
            {plan.days.map((d, i) => (
              <details key={i} className="rounded-2xl bg-card shadow-card p-4" open={i === 0}>
                <summary className="font-display font-semibold cursor-pointer text-foreground">
                  {d.day}
                </summary>
                <ul className="mt-2 space-y-1.5 text-sm font-body text-foreground">
                  <li><strong>{c.ruby.mealPlan.breakfast}:</strong> {d.breakfast}</li>
                  <li><strong>{c.ruby.mealPlan.lunch}:</strong> {d.lunch}</li>
                  <li><strong>{c.ruby.mealPlan.dinner}:</strong> {d.dinner}</li>
                  <li><strong>{c.ruby.mealPlan.snack}:</strong> {d.snack}</li>
                  {d.notes && (
                    <li className="text-xs text-muted-foreground italic mt-1">{d.notes}</li>
                  )}
                </ul>
              </details>
            ))}
            <Button
              onClick={() => navigate("/ai-grocery")}
              variant="outline"
              className="w-full rounded-xl"
            >
              <ShoppingBasket className="w-4 h-4 mr-2" />
              {c.ruby.mealPlan.makeGrocery}
            </Button>
          </motion.div>
        )}

        <h2 className="font-display text-lg font-semibold mb-2 mt-4">{c.ruby.mealPlan.savedPlans}</h2>
        {saved.length === 0 ? (
          <p className="text-sm text-muted-foreground font-body">{c.ruby.mealPlan.empty}</p>
        ) : (
          <ul className="space-y-2">
            {saved.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-card shadow-card"
              >
                <button
                  onClick={() => setPlan(p.plan_json)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-body font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.phases[p.phase]} · {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </button>
                <button
                  onClick={() => deletePlan(p.id)}
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

export default AiMealsPage;
