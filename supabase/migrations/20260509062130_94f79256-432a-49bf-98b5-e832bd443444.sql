
-- Cycle phase enum (reuse if it exists, else create)
DO $$ BEGIN
  CREATE TYPE public.cycle_phase AS ENUM ('menstrual','follicular','ovulation','luteal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============== monthly_plans ==============
CREATE TABLE IF NOT EXISTS public.monthly_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase public.cycle_phase NOT NULL,
  title text NOT NULL,
  plan_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_monthly_plans_user ON public.monthly_plans(user_id, created_at DESC);
ALTER TABLE public.monthly_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own monthly plans"
  ON public.monthly_plans FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own monthly plans"
  ON public.monthly_plans FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own monthly plans"
  ON public.monthly_plans FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users delete own monthly plans"
  ON public.monthly_plans FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER trg_monthly_plans_updated
  BEFORE UPDATE ON public.monthly_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== recipe_lists ==============
CREATE TABLE IF NOT EXISTS public.recipe_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phase public.cycle_phase,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recipe_lists_user ON public.recipe_lists(user_id, created_at DESC);
ALTER TABLE public.recipe_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own recipe lists"
  ON public.recipe_lists FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own recipe lists"
  ON public.recipe_lists FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own recipe lists"
  ON public.recipe_lists FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own recipe lists"
  ON public.recipe_lists FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_recipe_lists_updated
  BEFORE UPDATE ON public.recipe_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== recipes ==============
CREATE TABLE IF NOT EXISTS public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES public.recipe_lists(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  ingredients text[] NOT NULL DEFAULT '{}',
  notes text,
  source_url text,
  phase public.cycle_phase,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recipes_list ON public.recipes(list_id, created_at DESC);
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own recipes"
  ON public.recipes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own recipes"
  ON public.recipes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own recipes"
  ON public.recipes FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own recipes"
  ON public.recipes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_recipes_updated
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== food_swaps (curated, public-read) ==============
CREATE TABLE IF NOT EXISTS public.food_swaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  swap_from text NOT NULL,
  swap_to text NOT NULL,
  why_md text NOT NULL,
  phase public.cycle_phase,
  goals text[] NOT NULL DEFAULT '{}',
  source_citation text,
  source_url text,
  lang text NOT NULL DEFAULT 'en',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_food_swaps_slug_lang ON public.food_swaps(slug, lang);
ALTER TABLE public.food_swaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users view food swaps"
  ON public.food_swaps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role manages food swaps"
  ON public.food_swaps FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============== symptom_logs ==============
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  symptom_key text NOT NULL,
  intensity smallint NOT NULL DEFAULT 2,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_day ON public.symptom_logs(user_id, logged_on DESC);
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own symptom logs"
  ON public.symptom_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own symptom logs"
  ON public.symptom_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own symptom logs"
  ON public.symptom_logs FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own symptom logs"
  ON public.symptom_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

-- intensity sanity check via trigger (avoid CHECK to stay flexible)
CREATE OR REPLACE FUNCTION public.validate_symptom_intensity()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.intensity < 1 OR NEW.intensity > 3 THEN
    RAISE EXCEPTION 'intensity must be between 1 and 3';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_validate_symptom_intensity
  BEFORE INSERT OR UPDATE ON public.symptom_logs
  FOR EACH ROW EXECUTE FUNCTION public.validate_symptom_intensity();

-- ============== cycle_logs ==============
CREATE TABLE IF NOT EXISTS public.cycle_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_on date NOT NULL,
  ended_on date,
  flow text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cycle_logs_user ON public.cycle_logs(user_id, started_on DESC);
ALTER TABLE public.cycle_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own cycle logs"
  ON public.cycle_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own cycle logs"
  ON public.cycle_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own cycle logs"
  ON public.cycle_logs FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own cycle logs"
  ON public.cycle_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_cycle_logs_updated
  BEFORE UPDATE ON public.cycle_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
