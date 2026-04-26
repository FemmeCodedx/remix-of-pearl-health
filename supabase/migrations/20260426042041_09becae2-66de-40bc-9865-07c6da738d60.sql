-- Category enum
CREATE TYPE public.care_category AS ENUM ('period', 'wash', 'lube', 'postpartum');

-- BRANDS
CREATE TABLE public.care_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  why_clean text,
  image_url text,
  website_url text,
  category public.care_category NOT NULL,
  certifications text[] NOT NULL DEFAULT '{}',
  is_curated boolean NOT NULL DEFAULT false,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved boolean NOT NULL DEFAULT false,
  upvotes integer NOT NULL DEFAULT 0,
  lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_care_brands_category ON public.care_brands(category) WHERE approved = true;

ALTER TABLE public.care_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved brands are viewable by authenticated users"
  ON public.care_brands FOR SELECT TO authenticated
  USING (approved = true);

CREATE POLICY "Users see own pending submissions"
  ON public.care_brands FOR SELECT TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Authenticated users can submit brands"
  ON public.care_brands FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND approved = false
    AND is_curated = false
  );

-- LOCAL SHOPS
CREATE TABLE public.care_local_shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  city text,
  state text,
  postal_code text,
  country text NOT NULL DEFAULT 'US',
  latitude numeric(10,7),
  longitude numeric(10,7),
  phone text,
  website_url text,
  hours jsonb,
  categories_stocked text[] NOT NULL DEFAULT '{}',
  brands_stocked text[] NOT NULL DEFAULT '{}',
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved boolean NOT NULL DEFAULT false,
  upvotes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_care_shops_geo ON public.care_local_shops(latitude, longitude) WHERE approved = true;

ALTER TABLE public.care_local_shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved shops are viewable by authenticated users"
  ON public.care_local_shops FOR SELECT TO authenticated
  USING (approved = true);

CREATE POLICY "Users see own pending shop submissions"
  ON public.care_local_shops FOR SELECT TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Authenticated users can submit shops"
  ON public.care_local_shops FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND approved = false
  );

-- USER SAVES
CREATE TABLE public.care_user_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.care_brands(id) ON DELETE CASCADE,
  shop_id uuid REFERENCES public.care_local_shops(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exactly_one_target CHECK (
    (brand_id IS NOT NULL AND shop_id IS NULL)
    OR (brand_id IS NULL AND shop_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX uniq_user_brand_save ON public.care_user_saves(user_id, brand_id) WHERE brand_id IS NOT NULL;
CREATE UNIQUE INDEX uniq_user_shop_save  ON public.care_user_saves(user_id, shop_id)  WHERE shop_id  IS NOT NULL;

ALTER TABLE public.care_user_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saves"
  ON public.care_user_saves FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- UPVOTES
CREATE TABLE public.care_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.care_brands(id) ON DELETE CASCADE,
  shop_id uuid REFERENCES public.care_local_shops(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exactly_one_upvote_target CHECK (
    (brand_id IS NOT NULL AND shop_id IS NULL)
    OR (brand_id IS NULL AND shop_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX uniq_user_brand_upvote ON public.care_upvotes(user_id, brand_id) WHERE brand_id IS NOT NULL;
CREATE UNIQUE INDEX uniq_user_shop_upvote  ON public.care_upvotes(user_id, shop_id)  WHERE shop_id  IS NOT NULL;

ALTER TABLE public.care_upvotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own upvotes"
  ON public.care_upvotes FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Upvote counter trigger
CREATE OR REPLACE FUNCTION public.sync_upvote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.brand_id IS NOT NULL THEN
      UPDATE public.care_brands SET upvotes = upvotes + 1 WHERE id = NEW.brand_id;
    ELSIF NEW.shop_id IS NOT NULL THEN
      UPDATE public.care_local_shops SET upvotes = upvotes + 1 WHERE id = NEW.shop_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.brand_id IS NOT NULL THEN
      UPDATE public.care_brands SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.brand_id;
    ELSIF OLD.shop_id IS NOT NULL THEN
      UPDATE public.care_local_shops SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.shop_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_upvote_count
AFTER INSERT OR DELETE ON public.care_upvotes
FOR EACH ROW EXECUTE FUNCTION public.sync_upvote_count();

-- Distance search function (Haversine, miles)
CREATE OR REPLACE FUNCTION public.shops_within_radius(
  user_lat numeric,
  user_lng numeric,
  radius_miles numeric DEFAULT 25
)
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  city text,
  state text,
  postal_code text,
  phone text,
  website_url text,
  hours jsonb,
  categories_stocked text[],
  brands_stocked text[],
  upvotes integer,
  distance_miles numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id, s.name, s.address, s.city, s.state, s.postal_code, s.phone,
    s.website_url, s.hours, s.categories_stocked, s.brands_stocked, s.upvotes,
    (3959 * acos(
      cos(radians(user_lat)) * cos(radians(s.latitude))
      * cos(radians(s.longitude) - radians(user_lng))
      + sin(radians(user_lat)) * sin(radians(s.latitude))
    ))::numeric AS distance_miles
  FROM public.care_local_shops s
  WHERE s.approved = true
    AND s.latitude IS NOT NULL
    AND s.longitude IS NOT NULL
    AND (3959 * acos(
      cos(radians(user_lat)) * cos(radians(s.latitude))
      * cos(radians(s.longitude) - radians(user_lng))
      + sin(radians(user_lat)) * sin(radians(s.latitude))
    )) <= radius_miles
  ORDER BY distance_miles ASC
  LIMIT 100;
$$;

-- Seed curated brands
INSERT INTO public.care_brands (name, slug, description, why_clean, website_url, category, certifications, is_curated, approved) VALUES
('The Honey Pot', 'honey-pot', 'Plant-based feminine care line with herbal-infused pads and washes.', 'Plant-derived ingredients, no parabens, no sulfates, no dyes. OB/GYN approved.', 'https://thehoneypot.co', 'wash', ARRAY['plant_based','paraben_free','ob_gyn_approved'], true, true),
('Cora', 'cora', 'Organic cotton tampons, pads, and liners — clean ingredients, full transparency.', '100% organic cotton, no fragrance, no dyes, no chlorine bleaching.', 'https://cora.life', 'period', ARRAY['organic','fragrance_free','chlorine_free'], true, true),
('August', 'august', 'Carbon-neutral organic cotton period care from a women-led brand.', 'GOTS-certified organic cotton, no plastic applicators, fully compostable wrappers.', 'https://itsaugust.co', 'period', ARRAY['organic','gots_certified','compostable'], true, true),
('Saalt', 'saalt', 'Medical-grade silicone menstrual cups and reusable period underwear.', 'FDA-registered medical-grade silicone, no PFAS, ethically made.', 'https://saalt.com', 'period', ARRAY['fda_registered','pfas_free','reusable'], true, true),
('LOLA', 'lola', 'Subscription organic cotton period care + clean intimate wellness.', '100% organic cotton, transparent ingredient lists, gynecologist-developed.', 'https://mylola.com', 'period', ARRAY['organic','gynecologist_developed'], true, true),
('Rael', 'rael', 'K-beauty inspired organic period care, intimate wash, and skincare.', 'Certified organic cotton, no chemical additives, dermatologist-tested.', 'https://getrael.com', 'period', ARRAY['organic','dermatologist_tested'], true, true),
('Good Clean Love', 'good-clean-love', 'pH-balanced washes and personal lubricants.', 'No parabens, glycerin, petroleum, or fragrance. EWG-verified.', 'https://goodcleanlove.com', 'lube', ARRAY['ewg_verified','glycerin_free','paraben_free','fragrance_free'], true, true),
('Sustain Natural', 'sustain', 'Organic cotton period care and natural lubricants from sustainable sources.', 'Certified organic, no glycerin, no parabens, fair-trade rubber.', 'https://sustainnatural.com', 'lube', ARRAY['organic','glycerin_free','paraben_free','fair_trade'], true, true),
('Earth Mama Organics', 'earth-mama', 'Pregnancy and postpartum care from herbalist-formulated organic ingredients.', 'NSF/ANSI 305-certified organic, no synthetic fragrance, EWG-verified.', 'https://earthmamaorganics.com', 'postpartum', ARRAY['organic','ewg_verified','fragrance_free'], true, true),
('Frida Mom', 'frida-mom', 'Postpartum recovery essentials designed by and for new moms.', 'OB/GYN-developed, fragrance-free options, no harsh chemicals.', 'https://frida.com', 'postpartum', ARRAY['ob_gyn_developed','fragrance_free'], true, true),
('Aquasana / Lavanila', 'lavanila', 'Plant-based deodorants and gentle intimate wash for sensitive skin.', 'Aluminum-free, paraben-free, sulfate-free, vegan.', 'https://lavanila.com', 'wash', ARRAY['aluminum_free','paraben_free','vegan'], true, true),
('Thinx', 'thinx', 'Reusable period underwear in multiple absorbencies and styles.', 'OEKO-TEX certified, PFAS-free as of 2023, machine washable.', 'https://thinx.com', 'period', ARRAY['oeko_tex','pfas_free','reusable'], true, true);