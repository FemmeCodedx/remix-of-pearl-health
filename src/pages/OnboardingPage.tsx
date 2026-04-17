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

  const TOTAL = 10;
  const progress = ((step + 1) / TOTAL) * 100;

  const goNext = async () => {
    const next = Math.min(step + 1, TOTAL - 1);
    setStep(next);
    if (user) await save({ onboarding_step: next });
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const toggleArr = (key: "goals" | "health_focus", val: string) => {
    const cur = data[key] ?? [];
    const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
    save({ [key]: next } as any);
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
      toast({ title: "Welcome!", description: "Check your email to verify, then continue." });
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

  // ---------- Steps ----------
  const renderStep = () => {
    switch (step) {
      case 0: {
        const slides = [
          { icon: Sparkles, title: "Your body. Your rhythm. Your power.", body: "An inclusive wellness companion built for women & non-binary people." },
          { icon: Heart, title: "Personalized for your stage.", body: "From first cycle to post-menopause — content that meets you where you are." },
          { icon: Shield, title: "Private by design.", body: "Your data stays yours. You control what you share." },
        ];
        const Slide = slides[welcomeSlide];
        const Icon = Slide.icon;
        return (
          <StepShell title={Slide.title} subtitle={Slide.body}>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-32 h-32 rounded-full gradient-femme flex items-center justify-center shadow-glow">
                <Icon className="w-14 h-14 text-primary-foreground" />
              </div>
              <div className="flex gap-2 mt-8">
                {slides.map((_, i) => (
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
                {welcomeSlide < slides.length - 1 ? "Next" : "Get Started"}
              </Button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full text-center text-sm text-primary font-medium py-2"
              >
                I already have an account
              </button>
            </div>
          </StepShell>
        );
      }

      case 1:
        if (user) { setStep(2); return null; }
        return (
          <StepShell title="Create your account" subtitle="Use your real or chosen name — you can change it anytime.">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="rounded-xl h-11" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-11" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="rounded-xl h-11" placeholder="••••••••" />
              </div>
              <Button type="submit" disabled={authLoading} className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold">
                {authLoading ? "..." : "Continue"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By continuing you agree to our Terms & Privacy Policy.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button type="button" variant="outline" disabled className="h-11 rounded-xl">Apple</Button>
                <Button type="button" variant="outline" disabled className="h-11 rounded-xl">Google</Button>
              </div>
            </form>
          </StepShell>
        );

      case 2:
        return (
          <StepShell title="How do you identify?" subtitle="Optional. This helps us speak to you respectfully.">
            <div className="space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Gender identity</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {GENDER_OPTIONS.map((g) => (
                    <Chip key={g} label={g} selected={data.gender_identity === g} onClick={() => save({ gender_identity: g })} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Pronouns</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRONOUN_OPTIONS.map((p) => (
                    <Chip key={p} label={p} selected={data.pronouns === p} onClick={() => save({ pronouns: p })} />
                  ))}
                </div>
              </div>
            </div>
          </StepShell>
        );

      case 3:
        return (
          <StepShell title="What's your age range?" subtitle="We'll personalize content to your life stage.">
            <div className="grid grid-cols-2 gap-2">
              {AGE_GROUPS.map((g) => (
                <Chip key={g} label={`${g} years`} selected={data.age_group === g} onClick={() => save({ age_group: g })} />
              ))}
            </div>
          </StepShell>
        );

      case 4:
        return (
          <StepShell title="What brings you here?" subtitle="Pick all that apply.">
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <Chip key={g} label={g} selected={(data.goals ?? []).includes(g)} onClick={() => toggleArr("goals", g)} />
              ))}
            </div>
          </StepShell>
        );

      case 5:
        return (
          <StepShell title="Cycle basics" subtitle="Skip anything you'd rather not share.">
            <div className="space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Do you currently have a menstrual cycle?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["yes", "no", "unsure", "private"].map((v) => (
                    <Chip key={v} label={v === "private" ? "Prefer not to say" : v[0].toUpperCase() + v.slice(1)} selected={data.has_cycle === v} onClick={() => save({ has_cycle: v })} />
                  ))}
                </div>
              </div>

              {data.has_cycle === "yes" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Last period start date</Label>
                    <Input type="date" value={data.last_period_date ?? ""} onChange={(e) => save({ last_period_date: e.target.value })} className="rounded-xl h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Cycle length</Label>
                      <Input type="number" min={20} max={45} value={data.avg_cycle_length ?? 28} onChange={(e) => save({ avg_cycle_length: parseInt(e.target.value) || 28 })} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Period length</Label>
                      <Input type="number" min={1} max={10} value={data.avg_period_length ?? 5} onChange={(e) => save({ avg_period_length: parseInt(e.target.value) || 5 })} className="rounded-xl h-11" />
                    </div>
                  </div>
                </div>
              )}

              {data.has_cycle === "no" && (
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Reason (optional)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CYCLE_REASONS.map((r) => (
                      <Chip key={r} label={r} selected={data.no_cycle_reason === r} onClick={() => save({ no_cycle_reason: r })} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </StepShell>
        );

      case 6:
        return (
          <StepShell title="What should we focus on?" subtitle="Pick the areas you want to learn about.">
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((f) => (
                <Chip key={f} label={f} selected={(data.health_focus ?? []).includes(f)} onClick={() => toggleArr("health_focus", f)} />
              ))}
            </div>
          </StepShell>
        );

      case 7: {
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
          <StepShell title="Stay in rhythm" subtitle="Choose what you want to be reminded about. You're in control.">
            <div className="bg-card rounded-2xl px-4 shadow-card">
              <Toggle k="notif_period" label="Period reminders" desc="A heads-up before your next cycle." />
              <Toggle k="notif_ovulation" label="Ovulation window" desc="Know your fertile days." />
              <Toggle k="notif_checkin" label="Daily check-in" desc="Quick mood & symptom log." />
              <Toggle k="notif_digest" label="Weekly Learn digest" desc="Curated reads for your stage." />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              We never share your data. Read our <a className="text-primary underline" href="#">Privacy Policy</a>.
            </p>
          </StepShell>
        );
      }

      case 8: {
        const tiers = [
          { id: "pearl", name: "Pearl", price: "Free", desc: "Cycle tracking + basic Learn" },
          { id: "swan", name: "Swan", price: "$8/mo", desc: "Full Learn library + insights" },
          { id: "ruby", name: "Ruby", price: "$12/mo", desc: "Everything + 1:1 expert chats" },
        ];
        return (
          <StepShell title="Choose your plan" subtitle="Start free. Upgrade anytime.">
            <div className="space-y-3">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => save({ /* selection stored on subscriptions table elsewhere */ } as any)}
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

      case 9:
        return (
          <StepShell title={`Hi ${data.display_name || "there"}, you're all set ✨`} subtitle="Here's what we'll focus on with you:">
            <div className="space-y-3">
              {data.age_group && (
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Stage</p>
                  <p className="font-medium mt-1">{data.age_group} years</p>
                </div>
              )}
              {(data.goals ?? []).length > 0 && (
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Your goals</p>
                  <p className="font-medium mt-1">{(data.goals ?? []).join(" · ")}</p>
                </div>
              )}
              {(data.health_focus ?? []).length > 0 && (
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Focus areas</p>
                  <p className="font-medium mt-1">{(data.health_focus ?? []).join(" · ")}</p>
                </div>
              )}
            </div>
            <Button onClick={finish} className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold mt-6">
              Enter Pearl (FEMME) Health <Check className="ml-1" />
            </Button>
          </StepShell>
        );

      default:
        return null;
    }
  };

  // Hide footer on welcome (step 0), account (1), and done (9)
  const showFooter = step > 1 && step < 9;
  const canSkip = [2, 5, 6, 7, 8].includes(step);

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
              Skip
            </Button>
          )}
          <Button onClick={goNext} className="flex-1 h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold">
            Continue <ChevronRight className="ml-1" />
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
