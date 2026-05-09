## Homepage Premium tile

Add a premium-features tile to `HomePage` that adapts to the user's tier — promoting Swan upgrades for Pearl users, and acting as a quick-access launcher for Swan/Ruby members.

### Behavior

- **Pearl (free)**: Show a single eye-catching upsell card with gradient background, Crown icon, "Unlock Swan" headline, 3 bullet perks (PDF reports, recipe lists, food swaps), and a "See plans" button → `/pricing`. Animated in with framer-motion.
- **Swan / Ruby**: Replace the upsell with a 2x2 quick-access grid of premium destinations (Reports, Saved Plans, Recipes, Food Swaps), each tapping through to its route. Compact card style matching the existing quick-action grid.
- **While tier loads**: Render a Skeleton placeholder so layout doesn't jump.

### Placement

Insert between the existing **Quick actions grid** (line 108-123) and the `MedicalDisclaimer` (line 125). This keeps the hero/cycle ring + mood + quick actions intact at the top, with the premium tile as the next visual beat before the legal footer.

### i18n

Add the small string set (EN + ES) directly into the existing `src/lib/i18nSwan.ts` (already used by other premium pages):
- `homeUpsellTitle`, `homeUpsellSubtitle`, `homeUpsellCta`
- `homePremiumTitle` ("Your premium" / "Tu premium")
- Reuse existing `reports`, `plans`, `recipes`, `foodSwaps` labels

### Implementation

- Edit `src/pages/HomePage.tsx`:
  - Import `useTierAccess`, `useNavigate`, `Crown`, `FileBarChart`, `BookmarkCheck`, `ChefHat`, `Repeat`, `Skeleton`, `swanT` from i18nSwan
  - Add `const { hasSwan, isLoading } = useTierAccess()` and `const navigate = useNavigate()`
  - New `<PremiumTile />` block (inline or extracted) rendered conditionally
- Edit `src/lib/i18nSwan.ts`: add the 4 new keys for both languages
- No new files, no DB changes, no new deps

### Visual style

- Pearl upsell: `gradient-femme` background, white text, rounded-2xl, shadow-card, Crown icon in a frosted circle, prominent CTA pill
- Swan/Ruby grid: matches existing card style (`bg-card shadow-card rounded-2xl`), Crown header chip, 2x2 icon+label tiles
- Both fit mobile-first layout (current viewport 1000x720, but designed for ~390px width)

### Out of scope

- No changes to cycle ring, mood section, quick actions, or other pages
- No new routes (all 4 premium routes already exist)
- No copy changes to PricingPage