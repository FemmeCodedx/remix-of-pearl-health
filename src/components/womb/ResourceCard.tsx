import { ExternalLink, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { WombResource } from "@/hooks/useWombResources";

const categoryEmoji: Record<string, string> = {
  period_care: "🌸",
  midwife_doula: "🤱",
  fertility: "🌱",
  nutrition: "🍃",
  abortion_access: "🛡️",
};

export const ResourceCard = ({ resource }: { resource: WombResource }) => {
  const { t } = useI18n();
  const w = (t as any).womb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-card border border-border"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-soft-pink flex items-center justify-center text-2xl shrink-0">
          {categoryEmoji[resource.category] ?? "💗"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 flex-wrap">
              <span className="truncate">{resource.name}</span>
              {resource.is_curated && (
                <span title={w.vetted} className="inline-flex">
                  <ShieldCheck size={14} className="text-accent" />
                </span>
              )}
              {resource.is_national && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pearl text-foreground font-medium">
                  {w.national}
                </span>
              )}
            </h3>
            {resource.description && (
              <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
            )}
          </div>

          {resource.why_recommended && (
            <p className="text-xs text-foreground/70 mt-3 italic border-l-2 border-primary/30 pl-2">
              <Sparkles size={10} className="inline mr-1 text-accent" />
              {resource.why_recommended}
            </p>
          )}

          {resource.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {resource.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            {resource.website_url && (
              <a
                href={resource.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                {w.visitSite} <ExternalLink size={12} />
              </a>
            )}
            {resource.phone && (
              <a
                href={`tel:${resource.phone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1 text-foreground hover:underline"
              >
                <Phone size={12} /> {resource.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
