import { supabase } from "@/integrations/supabase/client";

// Public VAPID key — safe to embed in client.
export const VAPID_PUBLIC_KEY =
  "BGMh25Ki-FrMYQaPhzh_9vYI4MlSlW-JXH5Vpga5ibIORJW5vzdwDCaNZxj6jei8m3CWEhQS2GM4y0Lk9zl8quo";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

function bufToBase64Url(buf: ArrayBuffer | null) {
  if (!buf) return "";
  const bytes = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (navigator as any).standalone === true
  );
}

export function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export type DevicePlatform = "ios" | "android" | "macos" | "windows" | "linux" | "other";
export type BrowserName = "safari" | "chrome" | "firefox" | "edge" | "opera" | "samsung" | "other";

export function detectPlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Mac/i.test(ua)) return "macos";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux/i.test(ua)) return "linux";
  return "other";
}

export function detectBrowser(): BrowserName {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "edge";
  if (/OPR\//.test(ua)) return "opera";
  if (/SamsungBrowser/.test(ua)) return "samsung";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/Chrome\//.test(ua)) return "chrome";
  if (/Safari\//.test(ua)) return "safari";
  return "other";
}

export async function ensureServiceWorker() {
  if (!("serviceWorker" in navigator)) throw new Error("Service workers not supported");
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  return reg;
}

export async function enablePushNotifications(): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: "unsupported" };
  if (isIOS() && !isStandalone()) return { ok: false, reason: "ios-needs-install" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: "denied" };

  const reg = await ensureServiceWorker();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const json = sub.toJSON();
  const payload = {
    endpoint: sub.endpoint,
    p256dh: json.keys?.p256dh ?? bufToBase64Url(sub.getKey("p256dh")),
    auth: json.keys?.auth ?? bufToBase64Url(sub.getKey("auth")),
    user_agent: navigator.userAgent,
  };

  const { error } = await supabase.functions.invoke("save-push-subscription", {
    body: payload,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function disablePushNotifications() {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
  }
}

export async function currentPushStatus(): Promise<
  "granted" | "denied" | "default" | "unsupported" | "ios-needs-install"
> {
  if (!pushSupported()) return "unsupported";
  if (isIOS() && !isStandalone()) return "ios-needs-install";
  return Notification.permission;
}
