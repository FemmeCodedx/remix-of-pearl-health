import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { BookOpen, Star, Users } from "lucide-react";
import { articles as curatedArticles } from "@/data/articles";
import Seo from "@/components/Seo";

const CommunityPage = () => {
  const { t, lang } = useI18n();

  const articles = curatedArticles.map((a) => ({
    slug: a.slug,
    title: lang === "es" ? a.es.title : a.en.title,
    category: a.category,
    readTime: a.readTime,
    emoji: a.emoji,
    source: a.source,
  }));

  const womanOfWeek = {
    name: "Dr. Jolene Brighten",
    title: "Naturopathic Physician & Hormone Expert",
    quote: "Your hormones are not the enemy. Understanding them is the first step to taking back your power.",
    emoji: "👩‍⚕️",
  };

  return (
    <div className="px-5 pt-6">
      <Seo
        title="Community & Articles — Women's Wellness Library | Pearl Femme"
        description="Curated articles inspired by foundational women's health books. Read on hormones, cycle phases, equity in medicine, and everyday wellness."
        path="/community"
      />
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">{t.community}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t.communityDesc}</p>

      {/* Woman of the Week */}
      <div className="gradient-hero rounded-2xl p-5 mb-8 shadow-glow">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-gold" />
          <h2 className="text-sm font-bold text-primary-foreground/80 uppercase tracking-wider">
            {t.womanOfWeek}
          </h2>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-4xl">{womanOfWeek.emoji}</span>
          <div>
            <h3 className="text-lg font-display font-bold text-primary-foreground">{womanOfWeek.name}</h3>
            <p className="text-xs text-primary-foreground/70 mb-2">{womanOfWeek.title}</p>
            <p className="text-sm text-primary-foreground/90 italic">"{womanOfWeek.quote}"</p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-primary" />
        <h2 className="text-lg font-display font-semibold text-foreground">{t.articles}</h2>
      </div>

      <div className="space-y-3 mb-8">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/community/articles/${article.slug}`}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all text-left"
          >
            <span className="text-2xl">{article.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{article.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-soft-pink text-primary font-semibold">
                  {article.category}
                </span>
                <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
                <span className="text-[10px] text-muted-foreground italic truncate">
                  · {article.source.book}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Resources */}
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-magenta" />
        <h2 className="text-lg font-display font-semibold text-foreground">{t.resources}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {["Mentorship Directory", "Expert Q&A", "FEMME Philosophies", "Support Groups"].map((item) => (
          <div
            key={item}
            className="p-4 rounded-2xl bg-card shadow-card flex items-center justify-center text-center"
          >
            <span className="text-xs font-bold text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
