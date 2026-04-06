import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Brain, Wind, BookOpen, Smile, ChevronRight, Shield } from "lucide-react";

const LearnPage = () => {
  const { t } = useI18n();
  const [expandedHormone, setExpandedHormone] = useState<string | null>(null);

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

  const bcSections = [
    { title: t.comingOff, desc: "What to expect when stopping birth control. Your cycle may take 1-3 months to regulate." },
    { title: t.weaningOff, desc: "Gradual approaches and support for transitioning off hormonal birth control." },
    { title: t.facts, desc: "Evidence-based information to help you make informed decisions about your body." },
  ];

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">{t.learn}</h1>

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

      {/* Birth Control Guide */}
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
    </div>
  );
};

export default LearnPage;
