
CREATE TABLE public.ai_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature text NOT NULL,
  used_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc')::date),
  result_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_usage_user_feature_day ON public.ai_usage_log(user_id, feature, used_on);
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own ai usage" ON public.ai_usage_log FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own ai usage" ON public.ai_usage_log FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Service role manages ai usage" ON public.ai_usage_log FOR ALL TO public USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE TABLE public.ai_meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  phase cycle_phase NOT NULL,
  title text NOT NULL DEFAULT 'AI meal plan',
  plan_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own meal plans" ON public.ai_meal_plans FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own meal plans" ON public.ai_meal_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own meal plans" ON public.ai_meal_plans FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own meal plans" ON public.ai_meal_plans FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER update_ai_meal_plans_updated_at BEFORE UPDATE ON public.ai_meal_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.ai_grocery_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  source_id uuid,
  title text NOT NULL DEFAULT 'Grocery list',
  items_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_grocery_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own grocery lists" ON public.ai_grocery_lists FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own grocery lists" ON public.ai_grocery_lists FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own grocery lists" ON public.ai_grocery_lists FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own grocery lists" ON public.ai_grocery_lists FOR DELETE TO authenticated USING (user_id = auth.uid());
