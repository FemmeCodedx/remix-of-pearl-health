import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useLearnResources } from "@/hooks/useLearnResources";
import AgeGroupSelector from "@/components/AgeGroupSelector";
import { Brain, Wind, BookOpen, Smile, ChevronRight, Shield, Baby, Snowflake, HeartPulse, Apple, Settings2, Moon, Sun, Sparkles, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CareFinderSection from "@/components/care/CareFinderSection";
import WombCareSection from "@/components/womb/WombCareSection";
import Seo from "@/components/Seo";

const LearnPage = () => {
  const { t } = useI18n();
  const { ageGroup, user } = useAuth();
  const { resources, loading } = useLearnResources();
  const [expandedHormone, setExpandedHormone] = useState<string | null>(null);
  const [showAgeSelector, setShowAgeSelector] = useState(false);

  // Static hormone data (always shown, part of the core educational content)
  const hormones = [
    {
      name: t.estrogen,
      emoji: "🌸",
      color: "bg-primary/10 border-primary/20",
      description:
        "The 'feel-good' hormone. Estrogen boosts mood, energy, and skin glow during the follicular phase. It helps build the uterine lining and supports bone health.",
      tip: "💡 Think of estrogen as your body's 'spring season' — it brings renewal and energy.",
    },
    {
      name: t.progesterone,
      emoji: "🌙",
      color: "bg-magenta/10 border-magenta/20",
      description:
        "The 'calming' hormone. Progesterone rises after ovulation, preparing the body for potential pregnancy. It promotes relaxation and sleep.",
      tip: "💡 Think of progesterone as your body's 'cozy blanket' — it signals time to slow down.",
    },
    {
      name: t.testosterone,
      emoji: "⚡",
      color: "bg-tangerine/10 border-tangerine/20",
      description:
        "Not just for men! Testosterone peaks around ovulation, boosting confidence, libido, and energy. It supports muscle strength and drive.",
      tip: "💡 Think of testosterone as your 'power surge' — it fuels ambition and attraction.",
    },
  ];

  const mentalHealthTools = [
    { icon: Wind, label: t.breathe, desc: "4-7-8 breathing exercise", color: "text-primary" },
    { icon: BookOpen, label: t.journal, desc: "Guided prompts for reflection", color: "text-magenta" },
    { icon: Smile, label: t.moodTracker, desc: "Track patterns over time", color: "text-tangerine" },
  ];

  // Filter static sections by age group
  const showFertility = !ageGroup || !["12-16"].includes(ageGroup);
  const showBirthControl = !ageGroup || !["12-16", "55-65"].includes(ageGroup);

  const fertilitySections = [
    { icon: HeartPulse, title: t.fertilityAwareness, desc: t.fertilityAwarenessDesc, color: "text-primary", to: null as string | null },
    ...((!ageGroup || !["12-16", "17-24"].includes(ageGroup))
      ? [{ icon: Snowflake, title: t.eggFreezing, desc: t.eggFreezingDesc, color: "text-magenta", to: "/learn/egg-freezing" as string | null }]
      : []),
    ...((!ageGroup || !["12-16", "17-24", "25-30"].includes(ageGroup))
      ? [{ icon: Baby, title: t.ivf, desc: t.ivfDesc, color: "text-tangerine", to: null as string | null }]
      : []),
    { icon: Apple, title: t.fertilitySupplement, desc: t.fertilitySupplementDesc, color: "text-accent", to: null as string | null },
  ];

  const bcSections = [
    { title: t.comingOff, desc: "What to expect when stopping birth control. Your cycle may take 1-3 months to regulate." },
    { title: t.weaningOff, desc: "Gradual approaches and support for transitioning off hormonal birth control." },
    { title: t.facts, desc: "Evidence-based information to help you make informed decisions about your body." },
  ];

  // Group resources by category
  const resourcesByCategory = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">{t.learn}</h1>
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAgeSelector(true)}
            className="rounded-full text-xs gap-1.5"
          >
            <Settings2 size={14} />
            {ageGroup ? `${ageGroup} ${t.years}` : t.setAgeGroup}
          </Button>
        )}
      </div>

      <CareFinderSection />

      <WombCareSection />

      {/* Age-specific resources from database */}
      {ageGroup && resources.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-1">
            ✨ {t.personalizedForYou}
          </h2>
          <p className="text-xs text-muted-foreground mb-3">{t.forYourAgeGroup}: {ageGroup} {t.years}</p>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((r) => (
                <button
                  key={r.id}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg">
                    📖
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured: Luteal Phase Report */}
      {(!ageGroup || ageGroup !== "12-16") && (
        <Link
          to="/learn/luteal-phase"
          className="block mb-3 p-4 rounded-2xl bg-gradient-to-br from-magenta/10 via-primary/5 to-tangerine/10 border border-magenta/20 shadow-card hover:shadow-soft transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-magenta/15 flex items-center justify-center text-magenta shrink-0">
              <Moon size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display font-bold text-foreground">{t.lutealReportTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.lutealReportDesc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Featured: Follicular Phase Report */}
      {(!ageGroup || ageGroup !== "12-16") && (
        <Link
          to="/learn/follicular-phase"
          className="block mb-3 p-4 rounded-2xl bg-gradient-to-br from-tangerine/10 via-primary/5 to-magenta/10 border border-tangerine/20 shadow-card hover:shadow-soft transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tangerine/15 flex items-center justify-center text-tangerine shrink-0">
              <Sun size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display font-bold text-foreground">{t.follicularReportTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.follicularReportDesc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Featured: Ovulation Phase Report */}
      {(!ageGroup || ageGroup !== "12-16") && (
        <Link
          to="/learn/ovulation-phase"
          className="block mb-3 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-tangerine/5 to-magenta/10 border border-primary/20 shadow-card hover:shadow-soft transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display font-bold text-foreground">{t.ovulationReportTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.ovulationReportDesc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Featured: Menstruation Phase Report */}
      <Link
        to="/learn/menstruation-phase"
        className="block mb-3 p-4 rounded-2xl bg-gradient-to-br from-magenta/10 via-tangerine/5 to-primary/10 border border-magenta/20 shadow-card hover:shadow-soft transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-magenta/15 flex items-center justify-center text-magenta shrink-0">
            <Droplet size={22} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-display font-bold text-foreground">{t.menstruationReportTitle}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{t.menstruationReportDesc}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      </Link>

      {/* Featured: Maternal Health & Rights — hidden for under-17s */}
      {(!ageGroup || !["12-16"].includes(ageGroup)) && (
        <Link
          to="/learn/maternal-health"
          className="block mb-3 p-4 rounded-2xl bg-gradient-to-br from-magenta/15 via-primary/5 to-tangerine/10 border border-magenta/30 shadow-card hover:shadow-soft transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-magenta/15 flex items-center justify-center text-magenta shrink-0">
              <HeartPulse size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display font-bold text-foreground">{t.maternalHealthTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.maternalHealthDesc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Featured: Egg Freezing Guide — hidden for under-25s */}
      {(!ageGroup || !["12-16", "17-24"].includes(ageGroup)) && (
        <Link
          to="/learn/egg-freezing"
          className="block mb-8 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-magenta/5 to-tangerine/10 border border-primary/20 shadow-card hover:shadow-soft transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Snowflake size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display font-bold text-foreground">{t.eggFreezingReportTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.eggFreezingReportDesc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Hormone Education */}
      <h2 className="text-lg font-display font-semibold text-foreground mb-3">
        <Brain size={18} className="inline mr-2 text-primary" />
        {t.hormoneEd}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">{t.hormoneDesc}</p>

      <div className="space-y-3 mb-8">
        {hormones.map((h) => (
          <motion.div key={h.name} layout className={`rounded-2xl border ${h.color} overflow-hidden`}>
            <button
              onClick={() => setExpandedHormone(expandedHormone === h.name ? null : h.name)}
              className="w-full flex items-center gap-3 p-4"
            >
              <span className="text-2xl">{h.emoji}</span>
              <span className="text-sm font-display font-bold text-foreground flex-1 text-left">{h.name}</span>
              <ChevronRight
                size={18}
                className={`text-muted-foreground transition-transform ${
                  expandedHormone === h.name ? "rotate-90" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedHormone === h.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-foreground/80 mb-2">{h.description}</p>
                  <p className="text-xs text-primary font-semibold">{h.tip}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Fertility & Family Planning — hidden for youngest age group */}
      {showFertility && (
        <>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">
            <Baby size={18} className="inline mr-2 text-primary" />
            {t.fertility}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{t.fertilityDesc}</p>

          <div className="space-y-3 mb-8">
            {fertilitySections.map((sec) => {
              const inner = (
                <>
                  <sec.icon size={24} className={sec.color} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-foreground">{sec.title}</p>
                    <p className="text-xs text-muted-foreground">{sec.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </>
              );
              const className = "w-full flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all";
              return sec.to ? (
                <Link key={sec.title} to={sec.to} className={className}>{inner}</Link>
              ) : (
                <button key={sec.title} className={className}>{inner}</button>
              );
            })}
          </div>
        </>
      )}

      {/* Mental Health */}
      <h2 className="text-lg font-display font-semibold text-foreground mb-3">
        <Smile size={18} className="inline mr-2 text-tangerine" />
        {t.mentalHealth}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">{t.mentalHealthDesc}</p>

      <div className="space-y-3 mb-8">
        {mentalHealthTools.map((tool) => (
          <button
            key={tool.label}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all"
          >
            <tool.icon size={24} className={tool.color} />
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-foreground">{tool.label}</p>
              <p className="text-xs text-muted-foreground">{tool.desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Birth Control Guide — hidden for teens and post-menopause */}
      {showBirthControl && (
        <>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">
            <Shield size={18} className="inline mr-2 text-magenta" />
            {t.birthControl}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{t.bcGuide}</p>

          <div className="space-y-3 mb-6">
            {bcSections.map((sec) => (
              <div key={sec.title} className="p-4 rounded-2xl bg-card shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-1">{sec.title}</h3>
                <p className="text-xs text-muted-foreground">{sec.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <AgeGroupSelector open={showAgeSelector} onClose={() => setShowAgeSelector(false)} />
    </div>
  );
};

export default LearnPage;
