import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useRubyAi } from "@/hooks/useRubyAi";
import { useSwanCopy } from "@/lib/i18nSwan";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightResponse {
  insight: { phase: string; text: string; generated_at: string };
  cached: boolean;
}

const DailyInsightCard = () => {
  const c = useSwanCopy();
  const { invoke, loading } = useRubyAi<InsightResponse>();
  const [insight, setInsight] = useState<InsightResponse["insight"] | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchInsight = async () => {
    const res = await invoke("ai-daily-insight");
    if (res?.insight) setInsight(res.insight);
  };

  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
      fetchInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-4 p-4 rounded-2xl bg-card shadow-card border border-destructive/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-destructive" />
          <h2 className="font-display text-base font-semibold text-foreground">{c.ruby.insight.title}</h2>
        </div>
        <button
          onClick={fetchInsight}
          disabled={loading}
          aria-label={c.ruby.insight.refresh}
          className="p-1.5 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      {loading && !insight ? (
        <Skeleton className="h-16 w-full" />
      ) : insight ? (
        <p className="text-sm font-body text-foreground leading-relaxed whitespace-pre-line">
          {insight.text}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground font-body">{c.ruby.insight.fallback}</p>
      )}
    </motion.div>
  );
};

export default DailyInsightCard;
