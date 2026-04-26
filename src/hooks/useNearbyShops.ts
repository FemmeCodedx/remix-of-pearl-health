import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NearbyShop {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  website_url: string | null;
  hours: any;
  categories_stocked: string[];
  brands_stocked: string[];
  upvotes: number;
  distance_miles: number;
}

export const useNearbyShops = () => {
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (lat: number, lng: number, radius: number) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.rpc("shops_within_radius" as any, {
      user_lat: lat,
      user_lng: lng,
      radius_miles: radius,
    });
    if (error) {
      setError(error.message);
      setShops([]);
    } else {
      setShops((data ?? []) as NearbyShop[]);
    }
    setLoading(false);
  }, []);

  return { shops, loading, error, search };
};
