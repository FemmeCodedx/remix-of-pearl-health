# Curated Articles from Books → Community Section

## Source Books
1. *Doing Harm* — Maya Dusenbery (medical gaslighting, gender bias in medicine)
2. *Women's Bodies, Women's Wisdom* — Christiane Northrup (mind-body, cycle wisdom)
3. *New Dimensions in Women's Health* — Alexander et al. (textbook: prevention, equity, lifecycle)
4. *WomanCode* — Alisa Vitti (cycle syncing, hormone-balancing nutrition)

## What Will Be Built

### 1. Parse each PDF
Use `document--parse_document` on all four uploads. Extract 2–3 article-worthy insights per book (8–12 articles total). Each article gets: title, category, read time, emoji, summary (~150 words), 3–5 key takeaways, source attribution (book + author), and an optional "further reading" line.

### 2. Article data file
Create `src/data/articles.ts` exporting a typed `Article[]`:
```ts
type Article = {
  slug: string;
  emoji: string;
  category: "Education" | "Wellness" | "Nutrition" | "Equity" | "Lifestyle";
  readTime: string;
  source: { book: string; author: string };
  en: { title: string; summary: string; body: string[]; takeaways: string[] };
  es: { title: string; summary: string; body: string[]; takeaways: string[] };
};
```
Bilingual content authored directly (EN written from PDF, ES translated via the same Lovable AI pipeline used elsewhere).

### 3. CommunityPage update
Replace the hardcoded `articles` array in `src/pages/CommunityPage.tsx` with imports from `articles.ts`. Cards become `<Link>`s to `/community/articles/:slug`. Keep existing FEMME card styling (soft-pink chip, shadow-card).

### 4. New article detail page
- File: `src/pages/ArticlePage.tsx`
- Route: `/community/articles/:slug` (added to `src/App.tsx` inside `AppShell`)
- Layout: back button → emoji + category chip → title → "From *Book* by Author" attribution → summary → body paragraphs → "Key Takeaways" list → footer note recommending the original book.
- Pulls language from `useI18n()` to render `en` or `es`.
- 404 fallback if slug not found.

### 5. i18n strings
Add to `src/lib/i18n.tsx`: `keyTakeaways`, `fromBook`, `backToCommunity`, `articleNotFound` (EN + ES).

## Out of Scope
- No DB table — articles are static curated content per the agreed scope.
- No reading progress / favorites / comments.
- No PDF hosting; books are referenced by title/author only (copyright-safe paraphrasing, not excerpts).

## Files Touched
- new: `src/data/articles.ts`
- new: `src/pages/ArticlePage.tsx`
- edit: `src/pages/CommunityPage.tsx`
- edit: `src/App.tsx` (add route)
- edit: `src/lib/i18n.tsx` (add keys)
