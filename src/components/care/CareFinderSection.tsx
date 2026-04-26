import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCareBrands, type CareCategory } from "@/hooks/useCareBrands";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES: { id: CareCategory; emoji: string }[] = [
  { id: "period", emoji: "🌸" },
  { id: "wash", emoji: "🧴" },
  { id: "lube", emoji: "💧" },
  { id: "postpartum", emoji: "🤱" },
];

const CareFinderSection = () => {
  const { t } = useI18n();
  const c = (t as any).care;
  const { brands, loading } = useCareBrands(null, 3);

  return (
    <div className="bg-gradient-to-br from-soft-pink/40 to-pearl rounded-3xl p-5 mb-8 shadow-card border border-soft-pink">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="text-accent" size={18} />
            {c.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{c.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/care?cat=${cat.id}`}
            className="flex items-center gap-2 p-3 rounded-2xl bg-card hover:shadow-soft transition-all"
          >
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{c.categories[cat.id]}</span>
          </Link>
        ))}
      </div>

      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
        {c.featured}
      </p>
      <div className="space-y-2 mb-4">
        {loading
          ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
          : brands.map((b) => (
              <Link
                key={b.id}
                to="/care"
                className="flex items-center gap-3 p-3 rounded-xl bg-card hover:shadow-soft transition-all"
              >
                <span className="text-lg">
                  {CATEGORIES.find((c2) => c2.id === b.category)?.emoji ?? "🌿"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{b.description}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              </Link>
            ))}
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/care?tab=near-me"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl gradient-femme text-primary-foreground text-sm font-semibold"
        >
          <MapPin size={16} /> {c.nearMeCta}
        </Link>
        <Link
          to="/care"
          className="text-center text-xs font-semibold text-primary py-1"
        >
          {c.seeAll} →
        </Link>
      </div>
    </div>
  );
};

export default CareFinderSection;
