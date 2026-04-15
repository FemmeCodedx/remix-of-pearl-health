import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";

export interface LearnResource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  age_groups: string[];
  lang: string;
  icon: string | null;
  sort_order: number;
}

export const useLearnResources = () => {
  const { ageGroup } = useAuth();
  const { lang } = useI18n();
  const [resources, setResources] = useState<LearnResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from("learn_resources")
        .select("*")
        .eq("lang", lang)
        .order("sort_order");

      if (ageGroup) {
        query = query.contains("age_groups", [ageGroup]);
      }

      const { data, error } = await query;
      if (!error && data) {
        setResources(data as unknown as LearnResource[]);
      }
      setLoading(false);
    };

    fetch();
  }, [ageGroup, lang]);

  return { resources, loading };
};
