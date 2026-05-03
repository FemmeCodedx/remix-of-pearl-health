import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Users, ChevronRight, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ConditionsSection } from "@/components/ConditionsSection";
import { PhaseNotificationsCard } from "@/components/PhaseNotificationsCard";
import { PHYSICAL_CONDITIONS, MENTAL_CONDITIONS } from "./OnboardingPage";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, save, loading } = useOnboarding();
  const o = (t as any).onboarding;

  if (!user) {
    navigate("/auth");
    return null;
  }

  const toggle = (
    key: "physical_conditions" | "mental_conditions",
    val: string,
  ) => {
    const cur = (data as any)[key] ?? [];
    const next = cur.includes(val) ? cur.filter((v: string) => v !== val) : [...cur, val];
    save({ [key]: next } as any);
  };

  const addCustom = (
    key: "custom_physical_conditions" | "custom_mental_conditions",
    val: string,
  ) => {
    const cur = (data as any)[key] ?? [];
    save({ [key]: [...cur, val] } as any);
  };

  const removeCustom = (
    key: "custom_physical_conditions" | "custom_mental_conditions",
    val: string,
  ) => {
    const cur = (data as any)[key] ?? [];
    save({ [key]: cur.filter((v: string) => v !== val) } as any);
  };

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {data.display_name || "My profile"}
        </h1>
      </div>

      <div className="mb-4">
        <PhaseNotificationsCard />
      </div>

      <button
        onClick={() => navigate("/friends")}
        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-bold text-foreground">{(t as any).friends.title}</p>
          <p className="text-xs text-muted-foreground">{(t as any).friends.cardSubtitle}</p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      <h2 className="font-display text-xl font-semibold mt-4 mb-2">{o.conditions.title}</h2>
      <p className="text-sm text-muted-foreground mb-5">{o.conditions.subtitle}</p>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <ConditionsSection
            title={o.conditions.physicalLabel}
            subtitle={o.conditions.physicalSub}
            options={PHYSICAL_CONDITIONS}
            labels={o.physical}
            selected={data.physical_conditions ?? []}
            custom={data.custom_physical_conditions ?? []}
            customPlaceholder={o.conditions.customPlaceholderPhysical}
            addLabel={o.conditions.addCustom}
            onToggle={(v) => toggle("physical_conditions", v)}
            onAddCustom={(v) => addCustom("custom_physical_conditions", v)}
            onRemoveCustom={(v) => removeCustom("custom_physical_conditions", v)}
          />
          <ConditionsSection
            title={o.conditions.mentalLabel}
            subtitle={o.conditions.mentalSub}
            options={MENTAL_CONDITIONS}
            labels={o.mental}
            selected={data.mental_conditions ?? []}
            custom={data.custom_mental_conditions ?? []}
            customPlaceholder={o.conditions.customPlaceholderMental}
            addLabel={o.conditions.addCustom}
            onToggle={(v) => toggle("mental_conditions", v)}
            onAddCustom={(v) => addCustom("custom_mental_conditions", v)}
            onRemoveCustom={(v) => removeCustom("custom_mental_conditions", v)}
          />
          <p className="text-xs text-muted-foreground text-center pt-2">{o.conditions.privacy}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
