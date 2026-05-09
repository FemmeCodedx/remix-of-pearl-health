import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, BookmarkCheck, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSwanCopy } from "@/lib/i18nSwan";
import { useTierAccess } from "@/hooks/useTierAccess";
import UpgradeGate from "@/components/UpgradeGate";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  title: string;
  notes: string | null;
  plan_json: {
    nutrition?: string[];
    exercise?: string[];
    selfCare?: string[];
    seeds?: string[];
  };
  created_at: string;
}

const SavedPlansPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const c = useSwanCopy();
  const { hasSwan, isLoading: tierLoading } = useTierAccess();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !hasSwan) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("monthly_plans")
        .select("id,phase,title,notes,plan_json,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setPlans((data as Plan[]) ?? []);
      setLoading(false);
    })();
  }, [user, hasSwan]);

  const remove = async (id: string) => {
    if (!confirm(c.savedPlans.deleteConfirm)) return;
    await supabase.from("monthly_plans").delete().eq("id", id);
    setPlans((p) => p.filter((x) => x.id !== id));
    toast({ title: "✓" });
  };

  const content = loading ? (
    <div className="text-center text-sm text-muted-foreground py-12">{c.loading}</div>
  ) : plans.length === 0 ? (
    <div className="text-center py-12 px-5 bg-card rounded-2xl shadow-card">
      <BookmarkCheck size={32} className="mx-auto text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground font-body">{c.empty}</p>
    </div>
  ) : (
    <div className="space-y-3">
      {plans.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden"
        >
          <button
            onClick={() => setOpenId(openId === p.id ? null : p.id)}
            className="w-full text-left p-4 flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary font-bold uppercase tracking-wider">
                {c.phases[p.phase]}
              </p>
              <p className="font-display font-bold text-foreground truncate">{p.title}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
          </button>
          {openId === p.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              {p.notes && <p className="text-sm font-body text-foreground italic">{p.notes}</p>}
              <PlanSection label={c.savedPlans.nutrition} items={p.plan_json.nutrition} />
              <PlanSection label={c.savedPlans.exercise} items={p.plan_json.exercise} />
              <PlanSection label={c.savedPlans.selfCare} items={p.plan_json.selfCare} />
              <PlanSection label={c.savedPlans.seeds} items={p.plan_json.seeds} />
              <button
                onClick={() => remove(p.id)}
                className="text-xs text-destructive flex items-center gap-1 hover:underline"
              >
                <Trash2 size={12} /> {c.delete}
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-primary" />
          {c.savedPlans.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5 ml-13">{c.savedPlans.subtitle}</p>

      {tierLoading ? (
        <div className="text-center text-sm text-muted-foreground py-12">{c.loading}</div>
      ) : hasSwan ? (
        content
      ) : (
        <UpgradeGate required="swan" featureName={c.savedPlans.title} description={c.savedPlans.subtitle}>
          {content}
        </UpgradeGate>
      )}
    </div>
  );
};

const PlanSection = ({ label, items }: { label: string; items?: string[] }) => {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} className="text-xs px-2.5 py-1 rounded-full bg-soft-pink text-foreground font-medium">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SavedPlansPage;
