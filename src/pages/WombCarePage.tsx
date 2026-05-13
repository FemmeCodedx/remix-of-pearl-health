import { useState } from "react";
import Seo from "@/components/Seo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useWombResources, type WombCategory } from "@/hooks/useWombResources";
import { ResourceCard } from "@/components/womb/ResourceCard";
import NearMeWomb from "@/components/womb/NearMeWomb";
import SubmitWomb from "@/components/womb/SubmitWomb";

const CATEGORIES: { id: WombCategory | "all"; emoji: string }[] = [
  { id: "all", emoji: "✨" },
  { id: "period_care", emoji: "🌸" },
  { id: "midwife_doula", emoji: "🤱" },
  { id: "fertility", emoji: "🌱" },
  { id: "nutrition", emoji: "🍃" },
  { id: "abortion_access", emoji: "🛡️" },
];

const WombCarePage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { t } = useI18n();
  const w = (t as any).womb;

  const initialTab = params.get("tab") ?? "browse";
  const initialCat = (params.get("cat") as WombCategory) || null;
  const [tab, setTab] = useState(initialTab);
  const [category, setCategory] = useState<WombCategory | null>(initialCat);
  const { resources, loading } = useWombResources(category);

  const handleTabChange = (v: string) => {
    setTab(v);
    const next = new URLSearchParams(params);
    next.set("tab", v);
    setParams(next, { replace: true });
  };

  const handleCategory = (cat: WombCategory | "all") => {
    const next = cat === "all" ? null : cat;
    setCategory(next);
    const params2 = new URLSearchParams(params);
    if (next) params2.set("cat", next);
    else params2.delete("cat");
    setParams(params2, { replace: true });
  };

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <Seo title="Womb Care — Providers, Resources & Practitioners | Pearl Femme" description="Find womb-care providers, resources, and trusted practitioners. Submit your own to grow the directory." path="/womb-care" />
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="text-magenta" size={20} />
          {w.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{w.subtitle}</p>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="browse" className="text-xs">
            {w.browse}
          </TabsTrigger>
          <TabsTrigger value="near-me" className="text-xs">
            {w.nearMe}
          </TabsTrigger>
          <TabsTrigger value="submit" className="text-xs">
            {w.submit}
          </TabsTrigger>
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
                {cat.id === "all" ? w.allTypes : w.categories[cat.id]}
              </button>
            ))}
          </div>

          {category === "abortion_access" && (
            <div className="rounded-2xl bg-magenta/10 border border-magenta/20 p-4 mb-4">
              <p className="text-xs text-foreground/80 leading-relaxed">{w.abortionNotice}</p>
            </div>
          )}

          <div className="space-y-3">
            {loading &&
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
            {!loading && resources.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">{w.noResults}</p>
            )}
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">{w.disclaimerCurate}</p>
        </TabsContent>

        <TabsContent value="near-me">
          <NearMeWomb />
        </TabsContent>

        <TabsContent value="submit">
          <SubmitWomb />
          <p className="text-xs text-muted-foreground text-center mt-4">
            {w.disclaimerCommunity}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WombCarePage;
