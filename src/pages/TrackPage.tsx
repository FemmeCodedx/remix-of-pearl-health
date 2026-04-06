import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Droplets, Plus, CalendarDays } from "lucide-react";

const symptoms = [
  { emoji: "🤕", label: "Cramps" },
  { emoji: "😴", label: "Fatigue" },
  { emoji: "🤢", label: "Nausea" },
  { emoji: "😤", label: "Bloating" },
  { emoji: "💆", label: "Headache" },
  { emoji: "😢", label: "Mood swings" },
  { emoji: "🍫", label: "Cravings" },
  { emoji: "😰", label: "Anxiety" },
];

const TrackPage = () => {
  const { t } = useI18n();
  const [periodLogged, setPeriodLogged] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (label: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const phases = [
    { name: t.menstrual, days: "1-5", color: "bg-primary/20 text-primary", active: false },
    { name: t.follicular, days: "6-13", color: "bg-tangerine/20 text-tangerine", active: true },
    { name: t.ovulation, days: "14-16", color: "bg-gold/20 text-accent", active: false },
    { name: t.luteal, days: "17-28", color: "bg-magenta/20 text-magenta", active: false },
  ];

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">{t.track}</h1>

      {/* Log Period */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setPeriodLogged(!periodLogged)}
        className={`w-full flex items-center gap-4 p-5 rounded-2xl mb-6 transition-all ${
          periodLogged
            ? "gradient-femme shadow-glow"
            : "bg-card shadow-card"
        }`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          periodLogged ? "bg-primary-foreground/20" : "bg-primary/10"
        }`}>
          <Droplets size={28} className={periodLogged ? "text-primary-foreground" : "text-primary"} />
        </div>
        <div className="text-left">
          <p className={`text-lg font-display font-semibold ${periodLogged ? "text-primary-foreground" : "text-foreground"}`}>
            {t.logPeriod}
          </p>
          <p className={`text-sm ${periodLogged ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {periodLogged ? "✓ Logged today" : "Tap to log"}
          </p>
        </div>
      </motion.button>

      {/* Cycle Phases */}
      <h2 className="text-lg font-display font-semibold text-foreground mb-3">
        <CalendarDays size={18} className="inline mr-2" />
        {t.currentPhase}
      </h2>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {phases.map((phase) => (
          <div
            key={phase.name}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl ${phase.color} ${
              phase.active ? "ring-2 ring-primary shadow-soft" : ""
            }`}
          >
            <p className="text-sm font-bold">{phase.name}</p>
            <p className="text-xs opacity-70">{t.day} {phase.days}</p>
          </div>
        ))}
      </div>

      {/* Symptoms */}
      <h2 className="text-lg font-display font-semibold text-foreground mb-3">
        <Plus size={18} className="inline mr-2" />
        {t.logSymptom}
      </h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {symptoms.map((s) => {
          const isSelected = selectedSymptoms.includes(s.label);
          return (
            <button
              key={s.label}
              onClick={() => toggleSymptom(s.label)}
              className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                isSelected ? "bg-primary/10 ring-2 ring-primary" : "bg-card shadow-card"
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[10px] text-muted-foreground font-body leading-tight text-center">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrackPage;
