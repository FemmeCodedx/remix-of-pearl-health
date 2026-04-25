import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Heart, Sparkles, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { ConditionsSection } from "@/components/ConditionsSection";

const AGE_GROUPS = ["12-16", "17-24", "25-30", "30-35", "35-45", "45-55", "55-65"];

const GENDER_OPTIONS = [
  "Woman", "Non-binary", "Genderfluid", "Trans woman", "Trans man",
  "Prefer to self-describe", "Prefer not to say",
];
const PRONOUN_OPTIONS = ["she/her", "they/them", "he/him", "custom", "prefer not to say"];

const GOALS = [
  "Understand my cycle", "Track symptoms", "Plan for pregnancy", "Avoid pregnancy",
  "Egg freezing / IVF", "Manage PCOS/endo", "Perimenopause/menopause support",
  "Mental & emotional wellness", "Cycle-synced nutrition & fitness", "Just exploring",
];

const CYCLE_REASONS = [
  "Menopause", "Hormonal birth control", "Post-partum",
  "Medical reason", "Trans / non-menstruating", "Prefer not to say",
];

const FOCUS_BASE = ["Hormones", "Mood", "Sleep", "Energy", "Skin", "Libido", "Fertility", "Bone health", "Heart health"];

export const PHYSICAL_CONDITIONS = [
  "PCOS", "Endometriosis", "Adenomyosis", "Fibroids", "PMDD", "PMS (severe)",
  "Thyroid (hypo)", "Thyroid (hyper)", "Hashimoto's", "Graves'",
  "Insulin resistance", "Type 1 Diabetes", "Type 2 Diabetes",
  "IBS", "IBD (Crohn's/UC)", "GERD/Reflux", "Gastroparesis", "Celiac",
  "POTS", "hEDS / EDS", "Fibromyalgia", "ME/CFS", "Lupus",
  "Rheumatoid Arthritis", "Multiple Sclerosis", "Migraine (chronic)",
  "Interstitial Cystitis", "Vulvodynia", "Lipedema",
  "Perimenopause", "Menopause", "Long COVID", "MCAS",
  "Hidradenitis Suppurativa", "Psoriasis", "Eczema", "Asthma",
];

export const MENTAL_CONDITIONS = [
  "Anxiety", "Depression", "Bipolar I", "Bipolar II", "ADHD", "Autism (ASD)",
  "OCD", "PTSD", "C-PTSD",
  "ED — Anorexia", "ED — Bulimia", "ED — Binge Eating", "ARFID",
  "BPD", "Panic Disorder",
  "Postpartum Depression", "Postpartum Anxiety", "Seasonal Affective Disorder",
];

// ---------- Reusable bits ----------
const Chip = ({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-11 px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all text-left ${
      selected
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-card text-foreground hover:border-primary/40"
    }`}
  >
    {label}
  </button>
);

const StepShell = ({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25 }}
    className="flex-1 flex flex-col"
  >
    <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">{title}</h2>
    {subtitle && <p className="text-muted-foreground font-body mt-2 text-sm">{subtitle}</p>}
    <div className="flex-1 mt-6">{children}</div>
  </motion.div>
);

// ---------- Page ----------
const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, save, loading } = useOnboarding();
  const { t } = useI18n();

  const [step, setStep] = useState(0);
  const [welcomeSlide, setWelcomeSlide] = useState(0);

  // Account form local state (step 2)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!loading && data.onboarding_step) setStep(data.onboarding_step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // If user signed in mid-flow, jump past account step
  useEffect(() => {
    if (user && step === 1) setStep(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const focusOptions = useMemo(() => {
    const showHRT = ["35-45", "45-55", "55-65"].includes(data.age_group ?? "");
    return showHRT ? [...FOCUS_BASE, "HRT/perimenopause"] : FOCUS_BASE;
  }, [data.age_group]);

  const TOTAL = 11;
  const progress = ((step + 1) / TOTAL) * 100;

  const goNext = async () => {
    const next = Math.min(step + 1, TOTAL - 1);
    setStep(next);
    if (user) await save({ onboarding_step: next });
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const toggleArr = (
    key: "goals" | "health_focus" | "physical_conditions" | "mental_conditions",
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      toast({ title: (t as any).onboarding.account.welcomeToast, description: (t as any).onboarding.account.welcomeToastDesc });
      // optimistically advance — auth listener will pick up session
      setStep(2);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  const finish = async () => {
    await save({ onboarding_completed: true, onboarding_step: TOTAL - 1 });
    navigate("/");
  };

  const o = (t as any).onboarding;

  // ---------- Steps ----------
  const renderStep = () => {
    switch (step) {
      case 0: {
        const icons = [Sparkles, Heart, Shield];
        const slides = o.welcomeSlides;
        const Slide = slides[welcomeSlide];
        const Icon = icons[welcomeSlide];
        return (
          <StepShell title={Slide.title} subtitle={Slide.body}>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-32 h-32 rounded-full gradient-femme flex items-center justify-center shadow-glow">
                <Icon className="w-14 h-14 text-primary-foreground" />
              </div>
              <div className="flex gap-2 mt-8">
                {slides.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setWelcomeSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === welcomeSlide ? "w-8 bg-primary" : "w-2 bg-border"}`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <Button
                onClick={() => welcomeSlide < slides.length - 1 ? setWelcomeSlide(welcomeSlide + 1) : setStep(1)}
                className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold"
              >
                {welcomeSlide < slides.length - 1 ? o.next : o.getStarted}
              </Button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full text-center text-sm text-primary font-medium py-2"
              >
                {o.haveAccount}
              </button>
            </div>
          </StepShell>
        );
      }

      case 1:
        if (user) { setStep(2); return null; }
        return (
          <StepShell title={o.account.title} subtitle={o.account.subtitle}>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label>{o.account.name}</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="rounded-xl h-11" placeholder={o.account.namePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label>{o.account.email}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-11" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>{o.account.password}</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="rounded-xl h-11" placeholder="••••••••" />
              </div>
              <Button type="submit" disabled={authLoading} className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold">
                {authLoading ? "..." : o.continue}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{o.account.terms}</p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button type="button" variant="outline" disabled className="h-11 rounded-xl">Apple</Button>
                <Button type="button" variant="outline" disabled className="h-11 rounded-xl">Google</Button>
              </div>
            </form>
          </StepShell>
        );

      case 2:
        return (
          <StepShell title={o.identity.title} subtitle={o.identity.subtitle}>
            <div className="space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{o.identity.gender}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {GENDER_OPTIONS.map((g) => (
                    <Chip key={g} label={o.genders[g] ?? g} selected={data.gender_identity === g} onClick={() => save({ gender_identity: g })} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{o.identity.pronouns}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRONOUN_OPTIONS.map((p) => (
                    <Chip key={p} label={o.pronounLabels[p] ?? p} selected={data.pronouns === p} onClick={() => save({ pronouns: p })} />
                  ))}
                </div>
              </div>
            </div>
          </StepShell>
        );

      case 3:
        return (
          <StepShell title={o.age.title} subtitle={o.age.subtitle}>
            <div className="grid grid-cols-2 gap-2">
              {AGE_GROUPS.map((g) => (
                <Chip key={g} label={`${g} ${t.years}`} selected={data.age_group === g} onClick={() => save({ age_group: g })} />
              ))}
            </div>
          </StepShell>
        );

      case 4:
        return (
          <StepShell title={o.goalsStep.title} subtitle={o.goalsStep.subtitle}>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <Chip key={g} label={o.goals[g] ?? g} selected={(data.goals ?? []).includes(g)} onClick={() => toggleArr("goals", g)} />
              ))}
            </div>
          </StepShell>
        );

      case 5:
        return (
          <StepShell title={o.cycle.title} subtitle={o.cycle.subtitle}>
            <div className="space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">{o.cycle.question}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["yes", "no", "unsure", "private"].map((v) => (
                    <Chip key={v} label={o.cycle[v]} selected={data.has_cycle === v} onClick={() => save({ has_cycle: v })} />
                  ))}
                </div>
              </div>

              {data.has_cycle === "yes" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{o.cycle.lastPeriod}</Label>
                    <Input type="date" value={data.last_period_date ?? ""} onChange={(e) => save({ last_period_date: e.target.value })} className="rounded-xl h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{o.cycle.cycleLength}</Label>
                      <Input type="number" min={20} max={45} value={data.avg_cycle_length ?? 28} onChange={(e) => save({ avg_cycle_length: parseInt(e.target.value) || 28 })} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>{o.cycle.periodLength}</Label>
                      <Input type="number" min={1} max={10} value={data.avg_period_length ?? 5} onChange={(e) => save({ avg_period_length: parseInt(e.target.value) || 5 })} className="rounded-xl h-11" />
                    </div>
                  </div>
                </div>
              )}

              {data.has_cycle === "no" && (
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">{o.cycle.reason}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CYCLE_REASONS.map((r) => (
                      <Chip key={r} label={o.cycleReasons[r] ?? r} selected={data.no_cycle_reason === r} onClick={() => save({ no_cycle_reason: r })} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </StepShell>
        );

      case 6:
        return (
          <StepShell title={o.focusStep.title} subtitle={o.focusStep.subtitle}>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((f) => (
                <Chip key={f} label={o.focus[f] ?? f} selected={(data.health_focus ?? []).includes(f)} onClick={() => toggleArr("health_focus", f)} />
              ))}
            </div>
          </StepShell>
        );

      case 7:
        return (
          <StepShell title={o.conditions.title} subtitle={o.conditions.subtitle}>
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
                onToggle={(v) => toggleArr("physical_conditions", v)}
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
                onToggle={(v) => toggleArr("mental_conditions", v)}
                onAddCustom={(v) => addCustom("custom_mental_conditions", v)}
                onRemoveCustom={(v) => removeCustom("custom_mental_conditions", v)}
              />
              <p className="text-xs text-muted-foreground text-center pt-2">{o.conditions.privacy}</p>
            </div>
          </StepShell>
        );

      case 8: {
        const Toggle = ({ k, label, desc }: { k: keyof OnboardingToggleKeys; label: string; desc: string }) => (
          <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
            <Switch checked={!!(data as any)[k]} onCheckedChange={(v) => save({ [k]: v } as any)} />
          </div>
        );
        return (
          <StepShell title={o.notif.title} subtitle={o.notif.subtitle}>
            <div className="bg-card rounded-2xl px-4 shadow-card">
              <Toggle k="notif_period" label={o.notif.period} desc={o.notif.periodDesc} />
              <Toggle k="notif_ovulation" label={o.notif.ovulation} desc={o.notif.ovulationDesc} />
              <Toggle k="notif_checkin" label={o.notif.checkin} desc={o.notif.checkinDesc} />
              <Toggle k="notif_digest" label={o.notif.digest} desc={o.notif.digestDesc} />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {o.notif.privacy} <a className="text-primary underline" href="#">{o.notif.privacyLink}</a>.
            </p>
          </StepShell>
        );
      }

      case 9: {
        const tiers = [
          { id: "pearl", name: "Pearl", price: o.plan.free, desc: o.plan.pearlDesc },
          { id: "swan", name: "Swan", price: "$8/mo", desc: o.plan.swanDesc },
          { id: "ruby", name: "Ruby", price: "$12/mo", desc: o.plan.rubyDesc },
        ];
        return (
          <StepShell title={o.plan.title} subtitle={o.plan.subtitle}>
            <div className="space-y-3">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => save({} as any)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg font-semibold">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.desc}</p>
                    </div>
                    <p className="font-semibold text-primary">{tier.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </StepShell>
        );
      }

      case 10:
        return (
          <StepShell title={`${o.done.hi} ${data.display_name || o.done.there}, ${o.done.title}`} subtitle={o.done.subtitle}>
            <div className="space-y-3">
              {data.age_group && (
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{o.done.stage}</p>
                  <p className="font-medium mt-1">{data.age_group} {t.years}</p>
                </div>
              )}
              {(data.goals ?? []).length > 0 && (
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{o.done.yourGoals}</p>
                  <p className="font-medium mt-1">{(data.goals ?? []).map((g) => o.goals[g] ?? g).join(" · ")}</p>
                </div>
              )}
              {(data.health_focus ?? []).length > 0 && (
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{o.done.focusAreas}</p>
                  <p className="font-medium mt-1">{(data.health_focus ?? []).map((f) => o.focus[f] ?? f).join(" · ")}</p>
                </div>
              )}
            </div>
            <Button onClick={finish} className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold mt-6">
              {o.done.enter} <Check className="ml-1" />
            </Button>
          </StepShell>
        );

      default:
        return null;
    }
  };

  // Hide footer on welcome (step 0), account (1), and done (9)
  const showFooter = step > 1 && step < 10;
  const canSkip = [2, 5, 6, 7, 8, 9].includes(step);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-soft-pink/40 via-background to-background px-5 pt-6 pb-8 max-w-md mx-auto">
      {/* Top bar */}
      {step > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <button onClick={goBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Progress value={progress} className="h-1.5 flex-1" />
        </div>
      )}

      <AnimatePresence mode="wait">
        <div key={step} className="flex-1 flex flex-col">
          {renderStep()}
        </div>
      </AnimatePresence>

      {showFooter && (
        <div className="flex items-center gap-3 pt-4 mt-4">
          {canSkip && (
            <Button variant="ghost" onClick={goNext} className="flex-1 h-12 rounded-2xl">
              {(t as any).onboarding.skip}
            </Button>
          )}
          <Button onClick={goNext} className="flex-1 h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold">
            {(t as any).onboarding.continue} <ChevronRight className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

type OnboardingToggleKeys = {
  notif_period: boolean;
  notif_ovulation: boolean;
  notif_checkin: boolean;
  notif_digest: boolean;
};

export default OnboardingPage;
