import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type SubscriptionTier = "pearl" | "swan" | "ruby";

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data as Subscription;
    },
    enabled: !!user,
  });
};

export const useUpgradeSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: SubscriptionTier) => {
      if (!user) throw new Error("Not authenticated");

      console.log(`[Stripe Placeholder] Switching plan to: ${tier}`);

      const now = new Date().toISOString();
      const updateData =
        tier === "pearl"
          ? {
              tier,
              status: "active",
              stripe_customer_id: null,
              stripe_subscription_id: null,
              current_period_start: null,
              current_period_end: null,
              updated_at: now,
            }
          : {
              tier,
              status: "active",
              stripe_customer_id: `cus_placeholder_${user.id.slice(0, 8)}`,
              stripe_subscription_id: `sub_placeholder_${Date.now()}`,
              current_period_start: now,
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: now,
            };

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};

export const useCancelSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      console.log("[Stripe Placeholder] Canceling subscription at period end");
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};

export const useResumeSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      console.log("[Stripe Placeholder] Resuming subscription");
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};
