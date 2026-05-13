// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { articles } from "../src/data/articles";

const BASE_URL = "https://thepearlhealth.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().slice(0, 10);

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/track", changefreq: "weekly", priority: "0.8" },
  { path: "/learn", changefreq: "weekly", priority: "0.8" },
  { path: "/learn/follicular-phase", changefreq: "monthly", priority: "0.7" },
  { path: "/learn/ovulation-phase", changefreq: "monthly", priority: "0.7" },
  { path: "/learn/luteal-phase", changefreq: "monthly", priority: "0.7" },
  { path: "/learn/menstruation-phase", changefreq: "monthly", priority: "0.7" },
  { path: "/learn/egg-freezing", changefreq: "monthly", priority: "0.7" },
  { path: "/learn/maternal-health", changefreq: "monthly", priority: "0.7" },
  { path: "/community", changefreq: "weekly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/care", changefreq: "weekly", priority: "0.7" },
  { path: "/womb-care", changefreq: "weekly", priority: "0.7" },
  { path: "/recipes", changefreq: "weekly", priority: "0.6" },
  { path: "/food-swaps", changefreq: "monthly", priority: "0.6" },
  { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/refund", changefreq: "yearly", priority: "0.3" },
];

const articleEntries: SitemapEntry[] = articles.map((a) => ({
  path: `/community/articles/${a.slug}`,
  changefreq: "monthly",
  priority: "0.6",
  lastmod: today,
}));

const entries = [...staticEntries, ...articleEntries];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
