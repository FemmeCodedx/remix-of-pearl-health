import { MapPin, Phone, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { NearbyWombProvider } from "@/hooks/useNearbyWombProviders";

export const ProviderCard = ({ provider }: { provider: NearbyWombProvider }) => {
  const { t } = useI18n();
  const w = (t as any).womb;

  const mapUrl = provider.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${provider.name} ${provider.address} ${provider.city ?? ""} ${provider.state ?? ""}`,
      )}`
    : null;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-base text-foreground truncate">
            {provider.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate">
              {[provider.city, provider.state].filter(Boolean).join(", ")} ·{" "}
              {provider.distance_miles.toFixed(1)} {w.milesAway}
            </span>
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-soft-pink text-foreground font-medium shrink-0">
          {w.categories[provider.category] ?? provider.category}
        </span>
      </div>

      {provider.services?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {provider.services.slice(0, 6).map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-3 text-xs">
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            <MapPin size={12} /> {w.viewMap}
          </a>
        )}
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            className="inline-flex items-center gap-1 text-foreground hover:underline"
          >
            <Phone size={12} /> {provider.phone}
          </a>
        )}
        {provider.website_url && (
          <a
            href={provider.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground hover:underline"
          >
            <ExternalLink size={12} /> {w.visitSite}
          </a>
        )}
      </div>
    </div>
  );
};
