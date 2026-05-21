import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useSwanCopy } from "@/lib/i18nSwan";
import { useTierAccess } from "@/hooks/useTierAccess";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LanguageToggle from "@/components/LanguageToggle";
import { Heart, Droplets, Moon, Sparkles, Crown, FileBarChart, BookmarkCheck, ChefHat, Repeat, ChevronRight, Utensils, ShoppingBasket, TrendingUp } from "lucide-react";
import DailyInsightCard from "@/components/DailyInsightCard";
import UserMenu from "@/components/UserMenu";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { Skeleton } from "@/components/ui/skeleton";
import Seo from "@/components/Seo";

const HomePage = () => {
  const { t, lang } = useI18n();
  const s = useSwanCopy();
  const { hasSwan, hasRuby, isLoading: tierLoading } = useTierAccess();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [moodBusy, setMoodBusy] = useState(false);

  const cycleDay = 14;
  const currentPhase = t.follicular;
  const daysUntilPeriod = 14;

  const moods = [
    { key: "great", emoji: "😊", label: t.great },
    { key: "good", emoji: "🙂", label: t.good },
    { key: "okay", emoji: "😐", label: t.okay },
    { key: "not_great", emoji: "😔", label: t.notGreat },
  ];

  const todayStr = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("symptom_logs")
        .select("symptom_key")
        .eq("user_id", user.id)
        .eq("logged_on", todayStr())
        .like("symptom_key", "mood_%")
        .limit(1);
      if (data && data.length) setTodayMood(data[0].symptom_key.replace("mood_", ""));
    })();
  }, [user]);

  const selectMood = async (key: string) => {
    if (!user || moodBusy) return;
    setMoodBusy(true);
    try {
      const today = todayStr();
      await supabase
        .from("symptom_logs")
        .delete()
        .eq("user_id", user.id)
        .eq("logged_on", today)
        .like("symptom_key", "mood_%");
      const { error } = await supabase.from("symptom_logs").insert({
        user_id: user.id,
        symptom_key: `mood_${key}`,
        intensity: 2,
        logged_on: today,
      });
      if (error) throw error;
      setTodayMood(key);
      toast({ title: lang === "es" ? "Guardado" : "Saved" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setMoodBusy(false);
    }
  };

  const quickActions = [
    { icon: Droplets, label: t.logPeriod, color: "bg-primary/10 text-primary", path: "/track" },
    { icon: Heart, label: t.logSymptom, color: "bg-tangerine/10 text-tangerine", path: "/track" },
    { icon: Moon, label: t.cycleSync, color: "bg-magenta/10 text-magenta", path: "/sync" },
    { icon: Sparkles, label: t.mentalHealth, color: "bg-gold/10 text-accent", path: "/care" },
  ];

  return (
    <div className="px-5 pt-6">
      <Seo
        title="Pearl Femme — Cycle, Mood & Phase-Aware Wellness"
        description="Track your cycle, log your mood, and follow phase-aware wellness guidance. Pearl Femme is your daily women's wellness companion."
        path="/"
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground font-body">{t.welcome}</p>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            {t.appName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <UserMenu />
        </div>
      </div>

      {/* Cycle Ring */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto w-52 h-52 mb-6"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(330, 60%, 55%)" />
              <stop offset="50%" stopColor="hsl(320, 70%, 45%)" />
              <stop offset="100%" stopColor="hsl(20, 80%, 60%)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(340,15%,90%)" strokeWidth="10" />
          <circle
            cx="100" cy="100" r="85"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(cycleDay / 28) * 534} 534`}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-bold text-foreground">{t.day} {cycleDay}</span>
          <span className="text-sm text-muted-foreground font-body mt-1">{currentPhase}</span>
        </div>
      </motion.div>

      {/* Next period badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <div className="px-4 py-2 rounded-full gradient-soft shadow-card">
          <span className="text-sm font-semibold text-foreground">
            {t.nextPeriod}: <span className="text-primary">{daysUntilPeriod} {t.daysAway}</span>
          </span>
        </div>
      </motion.div>

      {/* Mood check */}
      <div className="mb-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-3">{t.howFeeling}</h2>
        <div className="flex gap-3">
          {moods.map((mood) => {
            const selected = todayMood === mood.key;
            return (
              <button
                key={mood.key}
                onClick={() => selectMood(mood.key)}
                disabled={moodBusy}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                  selected ? "bg-primary/10 ring-2 ring-primary shadow-soft" : "bg-card shadow-card hover:shadow-soft"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[11px] text-muted-foreground font-body">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all text-left`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
              <action.icon size={20} />
            </div>
            <span className="text-sm font-semibold text-foreground font-body">{action.label}</span>
          </motion.button>
        ))}
      </div>


      {/* Ruby daily insight */}
      {hasRuby && <DailyInsightCard />}

      {/* Premium tile */}
      {tierLoading ? (
        <Skeleton className="h-32 w-full rounded-2xl mb-6" />
      ) : hasSwan ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 p-4 rounded-2xl bg-card shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-primary" />
            <h2 className="font-display text-base font-semibold text-foreground">{s.home.premiumTitle}</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: TrendingUp, label: lang === "es" ? "Análisis" : "Insights", path: "/insights" },
              { icon: FileBarChart, label: s.home.reports, path: "/reports" },
              { icon: BookmarkCheck, label: s.home.plans, path: "/plans" },
              { icon: ChefHat, label: s.home.recipes, path: "/recipes" },
              { icon: Repeat, label: s.home.swaps, path: "/food-swaps" },
              ...(hasRuby
                ? [
                    { icon: Utensils, label: s.home.mealPlan, path: "/ai-meals" },
                    { icon: ShoppingBasket, label: s.home.grocery, path: "/ai-grocery" },
                  ]
                : []),
            ].map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-body text-foreground line-clamp-2">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate("/pricing")}
          className="w-full mb-6 p-5 rounded-2xl gradient-femme shadow-card text-left relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg font-bold text-primary-foreground">{s.home.upsellTitle}</h2>
              <p className="text-xs font-body text-primary-foreground/85 mt-1">{s.home.upsellSubtitle}</p>
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-full bg-primary-foreground text-primary text-xs font-body font-semibold">
                {s.home.upsellCta}
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </motion.button>
      )}

      <MedicalDisclaimer variant="inline" className="mb-4" />
    </div>
  );
};

export default HomePage;
