import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getArticleBySlug } from "@/data/articles";
import Seo from "@/components/Seo";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <div className="px-5 pt-6">
        <Link to="/community" className="inline-flex items-center gap-1 text-sm text-primary mb-6">
          <ArrowLeft size={16} /> {t.backToCommunity}
        </Link>
        <p className="text-sm text-muted-foreground">{t.articleNotFound}</p>
      </div>
    );
  }

  const content = lang === "es" ? article.es : article.en;

  return (
    <div className="px-5 pt-6 pb-10">
      <Seo
        title={`${content.title} | Pearl Femme`}
        description={content.summary.slice(0, 158)}
        path={`/community/articles/${article.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: content.title,
          description: content.summary,
          articleSection: article.category,
          inLanguage: lang === "es" ? "es" : "en",
          author: { "@type": "Person", name: article.source.author },
          citation: article.source.book,
          publisher: {
            "@type": "Organization",
            name: "Pearl Femme",
            logo: {
              "@type": "ImageObject",
              url: "https://thepearlhealth.lovable.app/icons/icon-512.png",
            },
          },
        }}
      />
      <Link
        to="/community"
        className="inline-flex items-center gap-1 text-sm text-primary mb-4 hover:underline"
      >
        <ArrowLeft size={16} /> {t.backToCommunity}
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-3xl">{article.emoji}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-soft-pink text-primary font-semibold uppercase tracking-wider">
          {article.category}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock size={10} /> {article.readTime}
        </span>
      </div>

      <h1 className="text-2xl font-display font-bold text-foreground leading-tight mb-2">
        {content.title}
      </h1>

      <p className="text-xs text-muted-foreground mb-5 inline-flex items-center gap-1">
        <BookOpen size={12} />
        <span>
          {t.fromBook}{" "}
          <em className="not-italic font-semibold text-foreground">{article.source.book}</em>{" "}
          — {article.source.author}
        </span>
      </p>

      <p className="text-sm text-foreground/90 italic mb-6 p-4 rounded-2xl bg-soft-pink/40">
        {content.summary}
      </p>

      <div className="space-y-4 mb-8">
        {content.body.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-foreground">
            {para}
          </p>
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-card p-5 mb-6">
        <h2 className="text-sm font-display font-bold text-foreground mb-3">
          {t.keyTakeaways}
        </h2>
        <ul className="space-y-2">
          {content.takeaways.map((tk, i) => (
            <li key={i} className="text-sm text-foreground flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>{tk}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground italic">
        {t.furtherReading}{" "}
        <span className="font-semibold text-foreground">{article.source.book}</span> —{" "}
        {article.source.author}.
      </p>
    </div>
  );
};

export default ArticlePage;
