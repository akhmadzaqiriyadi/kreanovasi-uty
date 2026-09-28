const CACHE_NAME = "uch-pwa-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/icon-maskable-512x512.png",
  "/favicon.ico",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // gracefully ignore cache failures on dynamic build paths
      });
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Bypass service worker for dynamic API requests, storage proxy, and HMR
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/uploads/") ||
    url.pathname.startsWith("/_next/webpack-hmr")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    }),
  );
});

// Web Push Notifications Event Listener (Background delivery even when app is closed)
self.addEventListener("push", (event) => {
  let data = {
    title: "Creative Hub UCH",
    message: "Ada pembaruan status peminjaman ruangan.",
    url: "/my-bookings",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.message = event.data.text();
    }
  }

  const title = data.title || "Creative Hub UCH";
  const body = data.message || data.body || "Pembaruan status reservasi.";
  const url = data.url || "/my-bookings";

  const options = {
    body: body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: data.bookingId ? `booking-${data.bookingId}` : "uch-notification",
    renotify: true,
    data: {
      url: url,
      timestamp: data.timestamp || Date.now(),
    },
    actions: [
      {
        action: "open",
        title: "Buka",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click notification handler (Focus existing window or open new window)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/my-bookings";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client) {
              return client.navigate(targetUrl);
            }
            return client;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
