import { Heart, MapPin, Phone, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCareSaves } from "@/hooks/useCareSaves";
import type { NearbyShop } from "@/hooks/useNearbyShops";

export const ShopCard = ({ shop }: { shop: NearbyShop }) => {
  const { t } = useI18n();
  const c = (t as any).care;
  const { savedShopIds, toggleShop } = useCareSaves();
  const isSaved = savedShopIds.has(shop.id);

  const mapUrl = shop.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${shop.name} ${shop.address} ${shop.city ?? ""} ${shop.state ?? ""}`
      )}`
    : null;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-base text-foreground truncate">{shop.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate">
              {[shop.city, shop.state].filter(Boolean).join(", ")} · {shop.distance_miles.toFixed(1)} {c.milesAway}
            </span>
          </p>
        </div>
        <button
          onClick={() => toggleShop(shop.id)}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label={isSaved ? c.saved : c.saveItem}
        >
          <Heart size={18} className={isSaved ? "fill-primary text-primary" : "text-muted-foreground"} />
        </button>
      </div>

      {shop.categories_stocked.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {shop.categories_stocked.map((cat) => (
            <span
              key={cat}
              className="text-[10px] px-2 py-0.5 rounded-full bg-soft-pink text-foreground font-medium"
            >
              {c.categories[cat] ?? cat}
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
            <MapPin size={12} /> {c.viewMap}
          </a>
        )}
        {shop.phone && (
          <a href={`tel:${shop.phone}`} className="inline-flex items-center gap-1 text-foreground hover:underline">
            <Phone size={12} /> {shop.phone}
          </a>
        )}
        {shop.website_url && (
          <a
            href={shop.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground hover:underline"
          >
            <ExternalLink size={12} /> {c.visitWebsite}
          </a>
        )}
      </div>
    </div>
  );
};
