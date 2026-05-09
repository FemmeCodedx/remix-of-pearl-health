import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTierAccess } from "@/hooks/useTierAccess";
import { useSwanCopy } from "@/lib/i18nSwan";

interface UpgradeGateProps {
  required: "swan" | "ruby";
  featureName: string;
  description?: string;
  children: ReactNode;
  /** Render a partial preview (e.g. first 3 items) before the gate. */
  preview?: ReactNode;
}

const UpgradeGate = ({ required, featureName, description, children, preview }: UpgradeGateProps) => {
  const navigate = useNavigate();
  const { hasSwan, hasRuby, isLoading } = useTierAccess();
  const c = useSwanCopy();

  const allowed = required === "swan" ? hasSwan : hasRuby;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground p-6 text-center">{c.loading}</div>;
  }
  if (allowed) return <>{children}</>;

  const Icon = required === "ruby" ? Sparkles : Crown;

  return (
    <div>
      {preview}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl border border-primary/30 bg-card shadow-card overflow-hidden"
      >
        <div className={`${required === "ruby" ? "bg-destructive" : "gradient-femme"} px-5 py-3 flex items-center gap-2`}>
          <Lock size={14} className="text-primary-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {required === "ruby" ? c.rubyFeature : c.swanFeature}
          </span>
        </div>
        <div className="p-5 text-center">
          <div className={`mx-auto mb-3 w-12 h-12 rounded-2xl flex items-center justify-center ${
            required === "ruby" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          }`}>
            <Icon size={22} />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-1">{featureName}</h3>
          {description && (
            <p className="text-sm text-muted-foreground font-body mb-4">{description}</p>
          )}
          <Button
            onClick={() => navigate("/pricing")}
            className={`w-full rounded-xl font-body font-semibold h-11 ${
              required === "ruby"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "gradient-femme text-primary-foreground"
            }`}
          >
            {required === "ruby" ? c.unlockRuby(featureName) : c.unlock(featureName)}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradeGate;
