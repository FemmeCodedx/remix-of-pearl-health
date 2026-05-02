import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export type WombCategory =
  | "period_care"
  | "midwife_doula"
  | "fertility"
  | "nutrition"
  | "abortion_access";

export interface WombResource {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  why_recommended: string | null;
  image_url: string | null;
  website_url: string | null;
  phone: string | null;
  category: WombCategory;
  tags: string[];
  is_curated: boolean;
  is_national: boolean;
  upvotes: number;
}

export const useWombResources = (category?: WombCategory | null, limit?: number) => {
  const { lang } = useI18n();
  const [resources, setResources] = useState<WombResource[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("womb_care_resources" as any)
      .select(
        "id, name, slug, description, why_recommended, image_url, website_url, phone, category, tags, is_curated, is_national, upvotes",
      )
      .eq("approved", true)
      .or(`lang.eq.${lang},lang.eq.en`)
      .order("is_curated", { ascending: false })
      .order("upvotes", { ascending: false });
    if (category) q = q.eq("category", category);
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (!error && data) setResources(data as unknown as WombResource[]);
    setLoading(false);
  }, [category, limit, lang]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { resources, loading, refetch };
};
