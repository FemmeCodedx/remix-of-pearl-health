import { useEffect, useState } from "react";
import { Bell, BellOff, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  currentPushStatus,
  disablePushNotifications,
  enablePushNotifications,
  isIOS,
  isStandalone,
  pushSupported,
} from "@/lib/push";
import { toast } from "sonner";

type Status = "granted" | "denied" | "default" | "unsupported" | "ios-needs-install";

export function PhaseNotificationsCard() {
  const { t } = useI18n();
  const n = (t as any).pushNotifs;
  const { data, save } = useOnboarding();
  const [status, setStatus] = useState<Status>("default");
  const [busy, setBusy] = useState(false);

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

      {supported && status !== "granted" && (
        <Button
          onClick={handleEnable}
          disabled={busy || status === "denied"}
          className="w-full mt-3"
          size="sm"
        >
          {status === "denied" ? n.deniedBlocked : n.enableBtn}
        </Button>
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
