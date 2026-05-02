-- ============================================================
-- FRIENDSHIPS + FRIEND PHASE NOTIFICATIONS
-- ============================================================

CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status public.friendship_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT friendships_no_self CHECK (requester_id <> addressee_id),
  CONSTRAINT friendships_unique_pair UNIQUE (requester_id, addressee_id)
);

CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view friendships involving them"
  ON public.friendships FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Users send friend requests"
  ON public.friendships FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid() AND status = 'pending');

CREATE POLICY "Addressee can accept/block, requester can cancel"
  ON public.friendships FOR UPDATE TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Either party can remove friendship"
  ON public.friendships FOR DELETE TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- Privacy preferences for friend phase sharing
ALTER TABLE public.profiles
  ADD COLUMN share_phase_with_friends boolean NOT NULL DEFAULT false,
  ADD COLUMN notif_friend_phase_change boolean NOT NULL DEFAULT true;

-- Allow authenticated users to look up other users by email/display name for friend search
-- (limited public profile view)
CREATE OR REPLACE FUNCTION public.search_users_for_friends(search_query text)
RETURNS TABLE (id uuid, display_name text, full_name text, email text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.full_name, p.email
  FROM public.profiles p
  WHERE p.id <> auth.uid()
    AND (
      p.email ILIKE '%' || search_query || '%'
      OR p.display_name ILIKE '%' || search_query || '%'
      OR p.full_name ILIKE '%' || search_query || '%'
    )
  LIMIT 20;
$$;

-- Helper: get accepted friend IDs for a user
CREATE OR REPLACE FUNCTION public.get_accepted_friend_ids(_user_id uuid)
RETURNS TABLE (friend_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT CASE
    WHEN requester_id = _user_id THEN addressee_id
    ELSE requester_id
  END
  FROM public.friendships
  WHERE status = 'accepted'
    AND (requester_id = _user_id OR addressee_id = _user_id);
$$;

-- Trigger to keep updated_at fresh on friendships
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_friendships_updated_at
BEFORE UPDATE ON public.friendships
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- WOMB CARE DIRECTORY
-- ============================================================

CREATE TYPE public.womb_care_category AS ENUM (
  'period_care',
  'midwife_doula',
  'fertility',
  'nutrition',
  'abortion_access'
);

CREATE TABLE public.womb_care_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  why_recommended text,
  image_url text,
  website_url text,
  phone text,
  category public.womb_care_category NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  is_curated boolean NOT NULL DEFAULT false,
  is_national boolean NOT NULL DEFAULT false,
  submitted_by uuid,
  approved boolean NOT NULL DEFAULT false,
  upvotes integer NOT NULL DEFAULT 0,
  lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_womb_resources_category ON public.womb_care_resources(category);
CREATE INDEX idx_womb_resources_approved ON public.womb_care_resources(approved);

ALTER TABLE public.womb_care_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved womb resources viewable by authenticated"
  ON public.womb_care_resources FOR SELECT TO authenticated
  USING (approved = true);

CREATE POLICY "Users see own pending womb submissions"
  ON public.womb_care_resources FOR SELECT TO authenticated
  USING (submitted_by = auth.uid());

-- Block community submissions for abortion_access (curated only)
CREATE POLICY "Authenticated can submit non-abortion resources"
  ON public.womb_care_resources FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND approved = false
    AND is_curated = false
    AND category <> 'abortion_access'
  );

-- Local providers (midwives, doulas, fertility clinics, nutritionists)
CREATE TABLE public.womb_care_local_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category public.womb_care_category NOT NULL,
  address text,
  city text,
  state text,
  postal_code text,
  country text NOT NULL DEFAULT 'US',
  latitude numeric,
  longitude numeric,
  phone text,
  website_url text,
  hours jsonb,
  services text[] NOT NULL DEFAULT '{}',
  submitted_by uuid,
  approved boolean NOT NULL DEFAULT false,
  upvotes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_womb_providers_category ON public.womb_care_local_providers(category);
CREATE INDEX idx_womb_providers_approved ON public.womb_care_local_providers(approved);
CREATE INDEX idx_womb_providers_geo ON public.womb_care_local_providers(latitude, longitude);

ALTER TABLE public.womb_care_local_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved womb providers viewable by authenticated"
  ON public.womb_care_local_providers FOR SELECT TO authenticated
  USING (approved = true);

CREATE POLICY "Users see own pending womb providers"
  ON public.womb_care_local_providers FOR SELECT TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Authenticated can submit non-abortion providers"
  ON public.womb_care_local_providers FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND approved = false
    AND category <> 'abortion_access'
  );

-- Upvotes
CREATE TABLE public.womb_care_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resource_id uuid,
  provider_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT womb_upvote_target CHECK (
    (resource_id IS NOT NULL AND provider_id IS NULL)
    OR (resource_id IS NULL AND provider_id IS NOT NULL)
  ),
  CONSTRAINT womb_upvote_unique_resource UNIQUE (user_id, resource_id),
  CONSTRAINT womb_upvote_unique_provider UNIQUE (user_id, provider_id)
);

ALTER TABLE public.womb_care_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own womb upvotes"
  ON public.womb_care_upvotes FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Saves
CREATE TABLE public.womb_care_user_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resource_id uuid,
  provider_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT womb_save_target CHECK (
    (resource_id IS NOT NULL AND provider_id IS NULL)
    OR (resource_id IS NULL AND provider_id IS NOT NULL)
  )
);

ALTER TABLE public.womb_care_user_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own womb saves"
  ON public.womb_care_user_saves FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Sync upvote counts
CREATE OR REPLACE FUNCTION public.sync_womb_upvote_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.resource_id IS NOT NULL THEN
      UPDATE public.womb_care_resources SET upvotes = upvotes + 1 WHERE id = NEW.resource_id;
    ELSIF NEW.provider_id IS NOT NULL THEN
      UPDATE public.womb_care_local_providers SET upvotes = upvotes + 1 WHERE id = NEW.provider_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.resource_id IS NOT NULL THEN
      UPDATE public.womb_care_resources SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.resource_id;
    ELSIF OLD.provider_id IS NOT NULL THEN
      UPDATE public.womb_care_local_providers SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.provider_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_womb_upvotes_count
AFTER INSERT OR DELETE ON public.womb_care_upvotes
FOR EACH ROW EXECUTE FUNCTION public.sync_womb_upvote_count();

-- Nearby providers RPC
CREATE OR REPLACE FUNCTION public.womb_providers_within_radius(
  user_lat numeric,
  user_lng numeric,
  radius_miles numeric DEFAULT 25,
  category_filter public.womb_care_category DEFAULT NULL
)
RETURNS TABLE (
  id uuid, name text, category public.womb_care_category, address text, city text, state text,
  postal_code text, phone text, website_url text, hours jsonb, services text[],
  upvotes integer, distance_miles numeric
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    p.id, p.name, p.category, p.address, p.city, p.state, p.postal_code,
    p.phone, p.website_url, p.hours, p.services, p.upvotes,
    (3959 * acos(
      cos(radians(user_lat)) * cos(radians(p.latitude))
      * cos(radians(p.longitude) - radians(user_lng))
      + sin(radians(user_lat)) * sin(radians(p.latitude))
    ))::numeric AS distance_miles
  FROM public.womb_care_local_providers p
  WHERE p.approved = true
    AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (3959 * acos(
      cos(radians(user_lat)) * cos(radians(p.latitude))
      * cos(radians(p.longitude) - radians(user_lng))
      + sin(radians(user_lat)) * sin(radians(p.latitude))
    )) <= radius_miles
  ORDER BY distance_miles ASC
  LIMIT 100;
$$;

-- ============================================================
-- SEED: vetted abortion access national orgs (curated, approved)
-- ============================================================
INSERT INTO public.womb_care_resources (name, slug, description, why_recommended, website_url, phone, category, tags, is_curated, is_national, approved, lang) VALUES
('Plan C', 'plan-c', 'Up-to-date information on how to access abortion pills by mail in all 50 US states.', 'Trusted national resource maintained by public health researchers.', 'https://www.plancpills.org', NULL, 'abortion_access', ARRAY['pills','telehealth','mail'], true, true, true, 'en'),
('AbortionFinder', 'abortion-finder', 'Verified directory of in-clinic and virtual abortion providers across the US.', 'Largest verified database of abortion providers in the US.', 'https://www.abortionfinder.org', NULL, 'abortion_access', ARRAY['clinics','telehealth','directory'], true, true, true, 'en'),
('INeedAnA.com', 'i-need-an-a', 'Find an abortion provider near you, including financial and travel support.', 'Connects users with providers and practical support funds.', 'https://www.ineedana.com', NULL, 'abortion_access', ARRAY['directory','funds','travel'], true, true, true, 'en'),
('Repro Legal Helpline', 'repro-legal-helpline', 'Free, confidential legal information about your right to abortion.', 'Confidential legal support from If/When/How attorneys.', 'https://www.reprolegalhelpline.org', '844-868-2812', 'abortion_access', ARRAY['legal','helpline'], true, true, true, 'en'),
('Miscarriage + Abortion Hotline', 'm-a-hotline', 'Free, confidential medical advice from clinicians about self-managed abortion and miscarriage.', 'Operated by board-certified clinicians.', 'https://www.mahotline.org', '833-246-2632', 'abortion_access', ARRAY['medical','helpline'], true, true, true, 'en'),
('Plan C', 'plan-c-es', 'Información actualizada sobre cómo acceder a pastillas abortivas por correo en los 50 estados de EE. UU.', 'Recurso nacional confiable mantenido por investigadores de salud pública.', 'https://www.plancpills.org/es', NULL, 'abortion_access', ARRAY['pastillas','telesalud','correo'], true, true, true, 'es'),
('AbortionFinder', 'abortion-finder-es', 'Directorio verificado de proveedores de aborto en clínica y virtuales en EE. UU.', 'La base de datos verificada más grande de proveedores de aborto en EE. UU.', 'https://www.abortionfinder.org/es', NULL, 'abortion_access', ARRAY['clínicas','telesalud','directorio'], true, true, true, 'es'),
('Línea Legal Reproductiva', 'repro-legal-helpline-es', 'Información legal gratuita y confidencial sobre tu derecho al aborto.', 'Apoyo legal confidencial de abogados de If/When/How.', 'https://www.reprolegalhelpline.org', '844-868-2812', 'abortion_access', ARRAY['legal','línea de ayuda'], true, true, true, 'es');
