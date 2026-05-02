import { useEffect, useState } from "react";
import { Bell, BellOff, Smartphone, Settings, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  currentPushStatus,
  detectBrowser,
  detectPlatform,
  disablePushNotifications,
  enablePushNotifications,
  isIOS,
  isStandalone,
  pushSupported,
} from "@/lib/push";
import { toast } from "sonner";

type Status = "granted" | "denied" | "default" | "unsupported" | "ios-needs-install";

function getDeviceSettingsSteps(t: any): string[] {
  const platform = detectPlatform();
  const browser = detectBrowser();
  const s = t.deniedSteps;
  if (platform === "ios") return s.iosSafari;
  if (platform === "android") return s.androidChrome;
  if (browser === "safari") return s.macSafari;
  if (browser === "firefox") return s.firefox;
  if (browser === "edge") return s.edge;
  return s.chrome;
}

export function PhaseNotificationsCard() {
  const { t } = useI18n();
  const n = (t as any).pushNotifs;
  const { data, save } = useOnboarding();
  const [status, setStatus] = useState<Status>("default");
  const [busy, setBusy] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    currentPushStatus().then(setStatus);
  }, []);

  const enabled = status === "granted" && (data as any).notif_phase_change !== false;
  const supported = pushSupported() && !(isIOS() && !isStandalone());

  const handleEnable = async () => {
    setBusy(true);
    const res = await enablePushNotifications();
    setBusy(false);
    if (res.ok) {
      toast.success(n.enabledToast);
      setStatus("granted");
      await save({ notif_phase_change: true } as any);
    } else if (res.reason === "denied") {
      toast.error(n.deniedToast);
      setStatus("denied");
      setShowSteps(true);
    } else if (res.reason === "ios-needs-install") {
      toast.message(n.iosHint);
    } else if (res.reason === "unsupported") {
      toast.error(n.unsupportedToast);
    } else {
      toast.error(res.reason ?? "Error");
    }
  };

  const handleToggleOptOut = async (next: boolean) => {
    await save({ notif_phase_change: next } as any);
    if (!next) {
      await disablePushNotifications();
      toast.success(n.optOutToast);
    } else if (status !== "granted") {
      handleEnable();
    }
  };

  const steps = getDeviceSettingsSteps(n);

  return (
    <div className="rounded-2xl bg-card shadow-card p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground">{n.title}</h3>
          <p className="text-xs text-muted-foreground">{n.subtitle}</p>
        </div>
      </div>

      {status === "unsupported" && (
        <p className="text-xs text-muted-foreground mt-3">{n.unsupported}</p>
      )}

      {status === "ios-needs-install" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted p-3">
          <Smartphone className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{n.iosHint}</p>
        </div>
      )}

      {supported && status !== "granted" && status !== "denied" && (
        <Button
          onClick={handleEnable}
          disabled={busy}
          className="w-full mt-3"
          size="sm"
        >
          {n.enableBtn}
        </Button>
      )}

      {status === "denied" && (
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 rounded-xl bg-muted p-3">
            <Settings className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">{n.deniedTitle}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.deniedDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSteps((v) => !v)}
            className="flex items-center justify-between w-full text-xs font-medium text-primary py-1.5"
          >
            <span>{n.howToFix}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSteps ? "rotate-180" : ""}`} />
          </button>
          {showSteps && (
            <ol className="text-xs text-muted-foreground space-y-1.5 pl-4 list-decimal">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          <Button
            onClick={handleEnable}
            variant="outline"
            disabled={busy}
            className="w-full mt-2"
            size="sm"
          >
            {n.retryBtn}
          </Button>
        </div>
      )}

      {status === "granted" && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-foreground">{n.optInLabel}</span>
          <Switch
            checked={(data as any).notif_phase_change !== false}
            onCheckedChange={handleToggleOptOut}
          />
        </div>
      )}
    </div>
  );
}
