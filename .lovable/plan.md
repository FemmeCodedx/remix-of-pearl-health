# Clean Care Finder — Non-Toxic Feminine Care

A new section inside the **Learn** page (with a dedicated `/care` page for the full experience) where users can discover non-toxic, women-vetted feminine care products online and find them locally.

## What the user gets

1. **Curated brand directory** — vetted non-toxic brands across 4 categories
2. **Community submissions** — users can suggest brands & local shops; admin-moderated
3. **Local "near me" search** — find stores within X miles using their location

## Categories at launch
- 🌸 Period care (pads, tampons, cups, period underwear, reusable cloth)
- 🧴 Intimate wash & wipes (pH-balanced, fragrance-free)
- 💧 Lubricants & intimacy (water/silicone-based, glycerin/paraben/fragrance-free)
- 🤱 Pregnancy & postpartum (belly balms, peri bottles, nursing care)

## Page layout

### Inside `/learn` (new section)
A "Clean Care Finder" card section with:
- Header: "🌿 Clean Care Finder" + subtitle "Non-toxic products vetted for your body"
- 4 category chips
- 2-3 featured curated products preview
- "Find clean care near me" pill (opens local search)
- "See all + submit a brand →" link to `/care`

### `/care` (new full page)
Tabs:
- **Browse** — filter by category, certifications (organic, OB/GYN-recommended, fragrance-free, EWG-verified), online vs local
- **Near Me** — location prompt → list of nearby shops with distance, hours, what categories they stock
- **Submit** — form for users to submit a brand or local shop (admin-approved before going live)
- **My Saves** — products the user has saved/favorited

Each product/shop card shows:
- Image, name, category badges, certifications
- Short why-it's-clean blurb
- "Buy online" link OR "View on map" + distance for local
- Save (heart) button + community upvote count

## Database schema (new tables)

**`care_brands`** — curated + approved community brands
- `id`, `name`, `slug`, `description`, `why_clean` (text), `image_url`, `website_url`
- `category` (enum: period, wash, lube, postpartum)
- `certifications` (text[]) — e.g. organic, fragrance_free, ewg_verified, ob_gyn_recommended
- `is_curated` (bool, default false), `submitted_by` (uuid → auth.users), `approved` (bool, default false)
- `upvotes` (int, default 0), `lang` (text, default 'en'), `created_at`

**`care_local_shops`** — local retailers stocking clean care
- `id`, `name`, `address`, `city`, `state`, `postal_code`, `country`
- `latitude`, `longitude` (numeric) — for distance calculations
- `phone`, `website_url`, `hours` (jsonb)
- `categories_stocked` (text[]), `brands_stocked` (text[])
- `submitted_by`, `approved` (bool, default false), `upvotes`, `created_at`

**`care_user_saves`** — favorites
- `id`, `user_id`, `brand_id` nullable, `shop_id` nullable, `created_at`

**`care_upvotes`** — one upvote per user per item
- `id`, `user_id`, `brand_id` nullable, `shop_id` nullable, unique `(user_id, brand_id)` and `(user_id, shop_id)`

### RLS policies
- `care_brands` / `care_local_shops`: SELECT for everyone where `approved = true`; INSERT for authenticated users (with `approved=false` enforced via trigger); SELECT own unapproved submissions
- `care_user_saves` / `care_upvotes`: full CRUD scoped to `auth.uid() = user_id`
- Upvote count maintained via trigger on insert/delete

### Seed data
Seed ~12 vetted brands (3 per category) — e.g. Honey Pot, Cora, August, Saalt, Lola, Rael, Good Clean Love, Sustain, Earth Mama, Frida Mom, etc. — with `is_curated=true, approved=true`.

## Local "near me" search

Use the **browser's Geolocation API** (free, no key) to get the user's coordinates, then query `care_local_shops` server-side with a Postgres distance calculation (Haversine via SQL function) and return shops within the chosen radius (default 25 miles).

- Privacy: location is requested per-session, never stored
- Fallback: ZIP code text input if geolocation is denied
- A simple list view at launch (no map embed) — keeps things lightweight and free

> **Note**: A Google Places live-discovery layer (auto-suggest shops we don't have in our DB) would require a Google Places API key + billing. I'm leaving that out at launch to keep it free; we can add it later if you want broader coverage. Let me know if you'd like that and I'll request the key.

## Components to create
- `src/pages/CarePage.tsx` — full /care page with tabs
- `src/components/care/CareFinderSection.tsx` — embedded section for Learn page
- `src/components/care/BrandCard.tsx`
- `src/components/care/ShopCard.tsx`
- `src/components/care/SubmitBrandDialog.tsx`
- `src/components/care/NearMeSearch.tsx` (geolocation + radius slider)
- `src/hooks/useCareBrands.ts`
- `src/hooks/useNearbyShops.ts`
- `src/hooks/useCareSaves.ts`

## Files to edit
- `src/App.tsx` — add `/care` route inside the AppShell routes
- `src/pages/LearnPage.tsx` — render `<CareFinderSection />` near the top
- `src/lib/i18n.tsx` — add full English + Spanish copy for the entire Care section (categories, certifications, CTAs, submission form labels, disclaimers)

## i18n
Bilingual copy for: section header & subtitle, 4 category names, 6+ certification labels, "Find near me", radius labels (5/10/25/50 mi), submission form fields, approval disclaimer ("Submissions reviewed within 48 hours"), empty states, saved tab label.

## Disclaimers (added in copy)
- "Pearl (FEMME) Health curates these brands but does not sell them. Always check ingredient lists for personal allergens."
- "Community submissions are reviewed before appearing publicly."
- "Local shop info is community-sourced — call ahead to confirm stock."

## Out of scope (suggest later)
- Admin moderation dashboard (for now, you'll approve via the database directly — I can build a simple admin UI in a follow-up)
- Google Places live discovery (needs paid API key)
- In-app affiliate purchase tracking
- Map view with pins (would need Mapbox / Google Maps key)
