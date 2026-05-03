import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Heart, ChevronRight, MapPin, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useWombResources, type WombCategory } from "@/hooks/useWombResources";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES: { id: WombCategory; emoji: string }[] = [
  { id: "period_care", emoji: "🌸" },
  { id: "midwife_doula", emoji: "🤱" },
  { id: "fertility", emoji: "🌱" },
  { id: "nutrition", emoji: "🍃" },
  { id: "abortion_access", emoji: "🛡️" },
];

const WombCareSection = () => {
  const { t } = useI18n();
  const w = (t as any).womb;
  const { resources, loading } = useWombResources(null, 3);

  return (
    <div className="bg-gradient-to-br from-pearl to-soft-pink/50 rounded-3xl p-5 mb-8 shadow-card border border-soft-pink">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Heart className="text-magenta" size={18} />
            {w.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{w.subtitle}</p>
        </div>
      </div>

      {/* Crisis support strip */}
      <div className="flex items-stretch gap-2 mb-3">
        <a
          href="tel:18338526262"
          className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-magenta/10 border border-magenta/30 hover:bg-magenta/15 transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-magenta/20 flex items-center justify-center text-magenta shrink-0">
            <Phone size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground leading-tight">{(t as any).wombCrisisLabel ?? "Maternal mental health crisis support"}</p>
            <p className="text-[11px] text-magenta font-semibold">{(t as any).wombCrisisCta ?? "Call 1-833-TLC-MAMA · 24/7"}</p>
          </div>
        </a>
        <Link
          to="/learn/maternal-health"
          className="flex items-center justify-center px-3 rounded-2xl bg-card border border-border text-[11px] font-bold text-primary"
        >
          More
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/womb-care?cat=${cat.id}`}
            className="flex items-center gap-2 p-3 rounded-2xl bg-card hover:shadow-soft transition-all"
          >
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{w.categories[cat.id]}</span>
          </Link>
        ))}
      </div>

      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
        {w.featured}
      </p>
      <div className="space-y-2 mb-4">
        {loading
          ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
          : resources.map((r) => (
              <Link
                key={r.id}
                to="/womb-care"
                className="flex items-center gap-3 p-3 rounded-xl bg-card hover:shadow-soft transition-all"
              >
                <span className="text-lg">
                  {CATEGORIES.find((c2) => c2.id === r.category)?.emoji ?? "💗"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate flex items-center gap-1">
                    {r.name}
                    {r.is_curated && <ShieldCheck size={10} className="text-accent" />}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.description}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              </Link>
            ))}
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/womb-care?tab=near-me"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl gradient-femme text-primary-foreground text-sm font-semibold"
        >
          <MapPin size={16} /> {w.nearMeCta}
        </Link>
        <Link to="/womb-care" className="text-center text-xs font-semibold text-primary py-1">
          {w.seeAll} →
        </Link>
      </div>
    </div>
  );
};

export default WombCareSection;
