/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// HTML navigations: NetworkFirst so users always get fresh shell when online.
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "html-pages",
      networkTimeoutSeconds: 3,
    }),
    {
      denylist: [/^\/~oauth/, /^\/api/, /^\/sw\.js$/, /^\/manifest\.webmanifest$/],
    },
  ),
);

// Images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  }),
);

// Fonts
registerRoute(
  ({ request }) => request.destination === "font",
  new CacheFirst({
    cacheName: "fonts",
    plugins: [
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 }),
    ],
  }),
);

// JS/CSS — stale-while-revalidate
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({ cacheName: "static-resources" }),
);

// ---- Push notifications (ported from public/sw.js) ----
self.addEventListener("push", (event) => {
  let payload: any = { title: "Pearl Femme", body: "" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    if (event.data) payload.body = event.data.text();
  }
  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon || "/icons/icon-192.png",
    badge: payload.badge || "/icons/icon-192.png",
    data: { url: payload.url || "/" },
    tag: payload.tag,
    // @ts-expect-error renotify supported on most platforms
    renotify: !!payload.tag,
  };
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const c of clients) {
          if ("focus" in c) {
            (c as WindowClient).navigate(targetUrl).catch(() => {});
            return (c as WindowClient).focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
