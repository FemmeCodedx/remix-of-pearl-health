import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { WombCategory } from "./useWombResources";

export interface NearbyWombProvider {
  id: string;
  name: string;
  category: WombCategory;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  website_url: string | null;
  hours: any;
  services: string[];
  upvotes: number;
  distance_miles: number;
}

export const useNearbyWombProviders = () => {
  const [providers, setProviders] = useState<NearbyWombProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (lat: number, lng: number, radius: number, category?: WombCategory | null) => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc("womb_providers_within_radius" as any, {
        user_lat: lat,
        user_lng: lng,
        radius_miles: radius,
        category_filter: category ?? null,
      });
      if (error) {
        setError(error.message);
        setProviders([]);
      } else {
        setProviders((data ?? []) as NearbyWombProvider[]);
      }
      setLoading(false);
    },
    [],
  );

  return { providers, loading, error, search };
};
