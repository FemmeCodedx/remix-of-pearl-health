import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const LegalFooter = () => {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 py-6 text-center border-t border-border/40 mt-4">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-body mb-2">
        <Link to="/legal/terms" className="hover:text-foreground hover:underline">
          {t.terms}
        </Link>
        <Link to="/legal/privacy" className="hover:text-foreground hover:underline">
          {t.privacyPolicy}
        </Link>
        <Link to="/legal/refund" className="hover:text-foreground hover:underline">
          {t.refundPolicy}
        </Link>
      </nav>
      <p className="text-[11px] text-muted-foreground/70 font-body">
        © {year} Gorgeous Girls Heal INC. {t.legalFooterRights}
      </p>
    </footer>
  );
};

export default LegalFooter;
