import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Leaf, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useSwanCopy, type Phase } from "@/lib/i18nSwan";
import { useTierAccess } from "@/hooks/useTierAccess";
import UpgradeGate from "@/components/UpgradeGate";

interface Swap {
  id: string;
  slug: string;
  swap_from: string;
  swap_to: string;
  why_md: string;
  phase: Phase | null;
  goals: string[];
  source_citation: string | null;
  source_url: string | null;
  lang: string;
}

const FoodSwapsPage = () => {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const c = useSwanCopy();
  const { hasSwan, isLoading: tierLoading } = useTierAccess();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [phaseFilter, setPhaseFilter] = useState<Phase | "all">("all");
  const [goalFilter, setGoalFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("food_swaps")
        .select("*")
        .eq("lang", lang)
        .order("sort_order", { ascending: true });
      let rows = (data as Swap[]) ?? [];
      // Fallback to English entries if the user-language seed is empty
      if (!rows.length && lang !== "en") {
        const { data: en } = await supabase.from("food_swaps").select("*").eq("lang", "en").order("sort_order", { ascending: true });
        rows = (en as Swap[]) ?? [];
      }
      setSwaps(rows);
      setLoading(false);
    })();
  }, [lang]);

  const goalsAvailable = useMemo(() => {
    const set = new Set<string>();
    swaps.forEach((s) => s.goals.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [swaps]);

  const filtered = useMemo(() => {
    return swaps.filter((s) => {
      if (phaseFilter !== "all" && s.phase !== phaseFilter) return false;
      if (goalFilter !== "all" && !s.goals.includes(goalFilter)) return false;
      return true;
    });
  }, [swaps, phaseFilter, goalFilter]);

  const visible = hasSwan ? filtered : filtered.slice(0, 3);

  const filters = (
    <div className="space-y-2 mb-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={phaseFilter === "all"} onClick={() => setPhaseFilter("all")}>{c.swaps.all}</Chip>
        {(["menstrual", "follicular", "ovulation", "luteal"] as Phase[]).map((p) => (
          <Chip key={p} active={phaseFilter === p} onClick={() => setPhaseFilter(p)}>{c.phases[p]}</Chip>
        ))}
      </div>
      {goalsAvailable.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={goalFilter === "all"} onClick={() => setGoalFilter("all")}>{c.swaps.all}</Chip>
          {goalsAvailable.map((g) => (
            <Chip key={g} active={goalFilter === g} onClick={() => setGoalFilter(g)}>
              {c.swaps.goals[g] ?? g}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );

  const list = (
    <div className="space-y-3">
      {visible.map((s) => (
        <div key={s.id} className="p-4 rounded-2xl bg-card shadow-card">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
            {s.phase ? c.phases[s.phase] : c.swaps.title}
          </p>
          <p className="font-display font-bold text-foreground mb-1">
            <span className="line-through text-muted-foreground">{s.swap_from}</span>
            <span className="mx-2 text-primary">→</span>
            <span>{s.swap_to}</span>
          </p>
          <p className="text-sm text-foreground/80 font-body mb-2">{s.why_md}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {s.goals.map((g) => (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-soft-pink text-primary font-semibold">
                {c.swaps.goals[g] ?? g}
              </span>
            ))}
          </div>
          {(s.source_citation || s.source_url) && (
            <p className="text-[11px] text-muted-foreground italic mt-2">
              {c.swaps.source}: {s.source_citation}
              {s.source_url && (
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1 inline-flex items-center gap-0.5">
                  <ExternalLink size={10} />
                </a>
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const teaserNotice = !hasSwan && filtered.length > 3 ? (
    <p className="text-xs text-center text-muted-foreground italic mb-3">
      {c.swaps.teaserNotice.replace("{n}", String(filtered.length))}
    </p>
  ) : null;

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" /> {c.swaps.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5 ml-13">{c.swaps.subtitle}</p>

      {loading || tierLoading ? (
        <div className="text-center text-sm text-muted-foreground py-12">{c.loading}</div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-12 px-5 bg-card rounded-2xl shadow-card text-sm text-muted-foreground">
          {c.empty}
        </div>
      ) : hasSwan ? (
        <>{filters}{list}</>
      ) : (
        <>
          {filters}
          {teaserNotice}
          <UpgradeGate required="swan" featureName={c.swaps.title} description={c.swaps.subtitle} preview={list}>
            <></>
          </UpgradeGate>
        </>
      )}
    </div>
  );
};

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
      active ? "gradient-femme text-primary-foreground" : "bg-card text-muted-foreground shadow-card"
    }`}
  >
    {children}
  </button>
);

export default FoodSwapsPage;
