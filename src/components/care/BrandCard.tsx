import { Heart, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useCareSaves } from "@/hooks/useCareSaves";
import type { CareBrand } from "@/hooks/useCareBrands";

const categoryEmoji: Record<string, string> = {
  period: "🌸",
  wash: "🧴",
  lube: "💧",
  postpartum: "🤱",
};

export const BrandCard = ({ brand }: { brand: CareBrand }) => {
  const { t } = useI18n();
  const c = (t as any).care;
  const { savedBrandIds, toggleBrand } = useCareSaves();
  const isSaved = savedBrandIds.has(brand.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-card border border-border"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-soft-pink flex items-center justify-center text-2xl shrink-0">
          {categoryEmoji[brand.category] ?? "🌿"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base text-foreground truncate flex items-center gap-1.5">
                {brand.name}
                {brand.is_curated && <Sparkles size={12} className="text-accent" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{brand.description}</p>
            </div>
            <button
              onClick={() => toggleBrand(brand.id)}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted"
              aria-label={isSaved ? c.saved : c.saveItem}
            >
              <Heart size={18} className={isSaved ? "fill-primary text-primary" : "text-muted-foreground"} />
            </button>
          </div>

          {brand.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {brand.certifications.slice(0, 4).map((cert) => (
                <span
                  key={cert}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-pearl text-foreground font-medium"
                >
                  {c.certifications[cert] ?? cert}
                </span>
              ))}
            </div>
          )}

          {brand.why_clean && (
            <p className="text-xs text-foreground/70 mt-3 italic border-l-2 border-primary/30 pl-2">
              {brand.why_clean}
            </p>
          )}

          {brand.website_url && (
            <a
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 hover:underline"
            >
              {c.buyOnline} <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
