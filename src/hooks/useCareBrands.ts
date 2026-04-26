import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CareCategory = "period" | "wash" | "lube" | "postpartum";

export interface CareBrand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  why_clean: string | null;
  image_url: string | null;
  website_url: string | null;
  category: CareCategory;
  certifications: string[];
  is_curated: boolean;
  upvotes: number;
}

export const useCareBrands = (category?: CareCategory | null, limit?: number) => {
  const [brands, setBrands] = useState<CareBrand[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("care_brands")
      .select("id, name, slug, description, why_clean, image_url, website_url, category, certifications, is_curated, upvotes")
      .eq("approved", true)
      .order("upvotes", { ascending: false })
      .order("is_curated", { ascending: false });
    if (category) q = q.eq("category", category);
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (!error && data) setBrands(data as CareBrand[]);
    setLoading(false);
  }, [category, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { brands, loading, refetch };
};
