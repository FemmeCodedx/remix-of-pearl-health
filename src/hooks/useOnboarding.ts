import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OnboardingData {
  display_name?: string | null;
  gender_identity?: string | null;
  pronouns?: string | null;
  age_group?: string | null;
  goals?: string[];
  health_focus?: string[];
  has_cycle?: string | null;
  no_cycle_reason?: string | null;
  last_period_date?: string | null;
  avg_cycle_length?: number | null;
  avg_period_length?: number | null;
  notif_period?: boolean;
  notif_ovulation?: boolean;
  notif_checkin?: boolean;
  notif_digest?: boolean;
  physical_conditions?: string[];
  mental_conditions?: string[];
  custom_physical_conditions?: string[];
  custom_mental_conditions?: string[];
  onboarding_step?: number;
  onboarding_completed?: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    health_focus: [],
    avg_cycle_length: 28,
    avg_period_length: 5,
    notif_period: true,
    notif_ovulation: true,
    notif_checkin: false,
    notif_digest: true,
    physical_conditions: [],
    mental_conditions: [],
    custom_physical_conditions: [],
    custom_mental_conditions: [],
    onboarding_step: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data: profile }) => {
        if (profile) {
          setData((prev) => ({ ...prev, ...(profile as any) }));
        }
        setLoading(false);
      });
  }, [user]);

  const save = useCallback(
    async (patch: OnboardingData) => {
      if (!user) return;
      setData((prev) => ({ ...prev, ...patch }));
      await supabase
        .from("profiles")
        .update({ ...patch, updated_at: new Date().toISOString() } as any)
        .eq("id", user.id);
    },
    [user]
  );

  return { data, save, loading };
};
