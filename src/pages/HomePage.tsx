import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import { Heart, Droplets, Moon, Sparkles } from "lucide-react";
import UserMenu from "@/components/UserMenu";

const HomePage = () => {
  const { t } = useI18n();

  const cycleDay = 14;
  const currentPhase = t.follicular;
  const daysUntilPeriod = 14;

  const moods = [
    { emoji: "😊", label: t.great },
    { emoji: "🙂", label: t.good },
    { emoji: "😐", label: t.okay },
    { emoji: "😔", label: t.notGreat },
  ];

  const quickActions = [
    { icon: Droplets, label: t.logPeriod, color: "bg-primary/10 text-primary" },
    { icon: Heart, label: t.logSymptom, color: "bg-tangerine/10 text-tangerine" },
    { icon: Moon, label: t.cycleSync, color: "bg-magenta/10 text-magenta" },
    { icon: Sparkles, label: t.mentalHealth, color: "bg-gold/10 text-accent" },
  ];

  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground font-body">{t.welcome}</p>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            {t.appName}
          </h1>
        </div>
        <LanguageToggle />
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
          {moods.map((mood) => (
            <button
              key={mood.label}
              className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-card shadow-card hover:shadow-soft transition-shadow"
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-[11px] text-muted-foreground font-body">{mood.label}</span>
            </button>
          ))}
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
            className={`flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
              <action.icon size={20} />
            </div>
            <span className="text-sm font-semibold text-foreground font-body">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
