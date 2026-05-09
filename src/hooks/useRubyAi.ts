import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Fn = "ai-daily-insight" | "ai-meal-plan" | "ai-grocery-list";

export const useRubyAi = <T = unknown>() => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const invoke = async (fn: Fn, body?: Record<string, unknown>): Promise<T | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(fn, { body: body ?? {} });
      if (error) {
        // supabase-js wraps non-2xx as FunctionsHttpError; the response body lives in data.
        const msg = (data as { error?: string })?.error || error.message || "Request failed";
        toast({ title: "AI error", description: msg, variant: "destructive" });
        return null;
      }
      if ((data as { error?: string })?.error) {
        toast({
          title: "AI error",
          description: (data as { error: string }).error,
          variant: "destructive",
        });
        return null;
      }
      return data as T;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unexpected error";
      toast({ title: "AI error", description: msg, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { invoke, loading };
};
