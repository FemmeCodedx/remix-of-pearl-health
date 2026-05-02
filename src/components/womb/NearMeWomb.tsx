import { useState } from "react";
import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNearbyWombProviders } from "@/hooks/useNearbyWombProviders";
import type { WombCategory } from "@/hooks/useWombResources";
import { ProviderCard } from "./ProviderCard";

const RADII = [5, 10, 25, 50] as const;
const CATEGORIES: WombCategory[] = ["midwife_doula", "fertility", "nutrition", "period_care"];

const NearMeWomb = () => {
  const { t } = useI18n();
  const w = (t as any).womb;
  const { toast } = useToast();
  const { providers, loading, error, search } = useNearbyWombProviders();
  const [radius, setRadius] = useState<number>(25);
  const [zip, setZip] = useState("");
  const [category, setCategory] = useState<WombCategory | null>(null);
  const [searched, setSearched] = useState(false);

  const useGeo = () => {
    if (!navigator.geolocation) {
      toast({ title: w.locationDenied });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await search(pos.coords.latitude, pos.coords.longitude, radius, category);
        setSearched(true);
      },
      () => toast({ title: w.locationDenied, variant: "destructive" }),
    );
  };

  const useZip = async () => {
    if (!zip.trim()) return;
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip.trim()}`);
      if (!res.ok) throw new Error("ZIP not found");
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) throw new Error("No location");
      await search(parseFloat(place.latitude), parseFloat(place.longitude), radius, category);
      setSearched(true);
    } catch {
      toast({ title: "Invalid ZIP code", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wide text-muted-foreground">
          {w.filterCategory}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 mt-2 -mx-1 px-1">
          <button
            onClick={() => setCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border-2 ${
              category === null
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card"
            }`}
          >
            {w.allTypes}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border-2 ${
                category === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card"
              }`}
            >
              {w.categories[cat]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-muted-foreground">{w.radius}</label>
        <div className="flex gap-2 mt-2">
          {RADII.map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`flex-1 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                radius === r
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={useGeo}
        className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold"
      >
        <MapPin className="mr-2" size={16} /> {w.useMyLocation}
      </Button>

      <div>
        <label className="text-xs uppercase tracking-wide text-muted-foreground">{w.enterZip}</label>
        <div className="flex gap-2 mt-2">
          <Input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="90210"
            className="rounded-xl h-11"
            inputMode="numeric"
            maxLength={10}
          />
          <Button onClick={useZip} variant="outline" className="h-11 rounded-xl">
            Search
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="space-y-3 pt-2">
        {loading && (
          <>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </>
        )}
        {!loading && searched && providers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">{w.noProviders}</p>
        )}
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">{w.disclaimerLocal}</p>
    </div>
  );
};

export default NearMeWomb;
