import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCareSaves = () => {
  const { user } = useAuth();
  const [savedBrandIds, setSavedBrandIds] = useState<Set<string>>(new Set());
  const [savedShopIds, setSavedShopIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) {
      setSavedBrandIds(new Set());
      setSavedShopIds(new Set());
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("care_user_saves")
      .select("brand_id, shop_id")
      .eq("user_id", user.id);
    const brands = new Set<string>();
    const shops = new Set<string>();
    (data ?? []).forEach((row: any) => {
      if (row.brand_id) brands.add(row.brand_id);
      if (row.shop_id) shops.add(row.shop_id);
    });
    setSavedBrandIds(brands);
    setSavedShopIds(shops);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleBrand = useCallback(
    async (brandId: string) => {
      if (!user) return;
      const isSaved = savedBrandIds.has(brandId);
      if (isSaved) {
        const next = new Set(savedBrandIds);
        next.delete(brandId);
        setSavedBrandIds(next);
        await supabase.from("care_user_saves").delete().eq("user_id", user.id).eq("brand_id", brandId);
      } else {
        const next = new Set(savedBrandIds);
        next.add(brandId);
        setSavedBrandIds(next);
        await supabase.from("care_user_saves").insert({ user_id: user.id, brand_id: brandId } as any);
      }
    },
    [user, savedBrandIds]
  );

  const toggleShop = useCallback(
    async (shopId: string) => {
      if (!user) return;
      const isSaved = savedShopIds.has(shopId);
      if (isSaved) {
        const next = new Set(savedShopIds);
        next.delete(shopId);
        setSavedShopIds(next);
        await supabase.from("care_user_saves").delete().eq("user_id", user.id).eq("shop_id", shopId);
      } else {
        const next = new Set(savedShopIds);
        next.add(shopId);
        setSavedShopIds(next);
        await supabase.from("care_user_saves").insert({ user_id: user.id, shop_id: shopId } as any);
      }
    },
    [user, savedShopIds]
  );

  return { savedBrandIds, savedShopIds, loading, toggleBrand, toggleShop, refetch };
};
