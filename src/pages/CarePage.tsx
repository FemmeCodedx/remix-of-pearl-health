import { useState, useMemo } from "react";
import Seo from "@/components/Seo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareBrands, type CareCategory } from "@/hooks/useCareBrands";
import { useCareSaves } from "@/hooks/useCareSaves";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { BrandCard } from "@/components/care/BrandCard";
import { ShopCard } from "@/components/care/ShopCard";
import NearMeSearch from "@/components/care/NearMeSearch";
import SubmitSection from "@/components/care/SubmitSection";

const CATEGORIES: { id: CareCategory | "all"; emoji: string }[] = [
  { id: "all", emoji: "✨" },
  { id: "period", emoji: "🌸" },
  { id: "wash", emoji: "🧴" },
  { id: "lube", emoji: "💧" },
  { id: "postpartum", emoji: "🤱" },
];

const CarePage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { t } = useI18n();
  const c = (t as any).care;

  const initialTab = params.get("tab") ?? "browse";
  const initialCat = (params.get("cat") as CareCategory) || null;
  const [tab, setTab] = useState(initialTab);
  const [category, setCategory] = useState<CareCategory | null>(initialCat);
  const { brands, loading } = useCareBrands(category);

  const handleTabChange = (v: string) => {
    setTab(v);
    const next = new URLSearchParams(params);
    next.set("tab", v);
    setParams(next, { replace: true });
  };

  const handleCategory = (cat: CareCategory | "all") => {
    const next = cat === "all" ? null : cat;
    setCategory(next);
    const params2 = new URLSearchParams(params);
    if (next) params2.set("cat", next);
    else params2.delete("cat");
    setParams(params2, { replace: true });
  };

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <Seo title="Care Finder — Women’s Health Brands & Shops Near You | Pearl Femme" description="Discover trusted women’s health brands and shops near you, curated by category." path="/care" />
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="text-accent" size={20} />
          {c.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{c.subtitle}</p>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="browse" className="text-xs">{c.browse}</TabsTrigger>
          <TabsTrigger value="near-me" className="text-xs">{c.nearMe}</TabsTrigger>
          <TabsTrigger value="saves" className="text-xs">{c.saves}</TabsTrigger>
          <TabsTrigger value="submit" className="text-xs">{c.submit}</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium border-2 whitespace-nowrap ${
                  (cat.id === "all" && category === null) || cat.id === category
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card"
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.id === "all" ? c.browse : c.categories[cat.id]}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {loading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
            {!loading && brands.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">{c.noResults}</p>
            )}
            {brands.map((b) => <BrandCard key={b.id} brand={b} />)}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">{c.disclaimerCurate}</p>
        </TabsContent>

        <TabsContent value="near-me">
          <NearMeSearch />
        </TabsContent>

        <TabsContent value="saves">
          <SavedTab />
        </TabsContent>

        <TabsContent value="submit">
          <SubmitSection />
          <p className="text-xs text-muted-foreground text-center mt-4">{c.disclaimerCommunity}</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SavedTab = () => {
  const { t } = useI18n();
  const c = (t as any).care;
  const { savedBrandIds, savedShopIds, loading } = useCareSaves();
  const [brands, setBrands] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const ids = Array.from(savedBrandIds);
      if (ids.length > 0) {
        const { data } = await supabase
          .from("care_brands")
          .select("*")
          .in("id", ids);
        setBrands(data ?? []);
      } else {
        setBrands([]);
      }
      const sids = Array.from(savedShopIds);
      if (sids.length > 0) {
        const { data } = await supabase
          .from("care_local_shops")
          .select("id, name, address, city, state, postal_code, phone, website_url, hours, categories_stocked, brands_stocked, upvotes")
          .in("id", sids);
        // shops without distance — set to 0 for display
        setShops((data ?? []).map((s: any) => ({ ...s, distance_miles: 0 })));
      } else {
        setShops([]);
      }
    };
    fetch();
  }, [savedBrandIds, savedShopIds]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (brands.length === 0 && shops.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">{c.empty}</p>;
  }

  return (
    <div className="space-y-3">
      {brands.map((b) => <BrandCard key={b.id} brand={b} />)}
      {shops.map((s) => <ShopCard key={s.id} shop={s} />)}
    </div>
  );
};

export default CarePage;
