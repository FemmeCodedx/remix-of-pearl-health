ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS physical_conditions text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mental_conditions text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS custom_physical_conditions text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS custom_mental_conditions text[] NOT NULL DEFAULT '{}';