
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDHPzV22QAopJCpwvwnsmiPEYSd6pRNamc",
  authDomain: "ruz-valley-pos.firebaseapp.com",
  projectId: "ruz-valley-pos",
  storageBucket: "ruz-valley-pos.firebasestorage.app",
  messagingSenderId: "1070715442602",
  appId: "1:1070715442602:web:08927d1e1f817047ee87d3"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const data = payload.data || {};
  const title =
    (payload.notification && payload.notification.title) ||
    data.title || "Ruz Valley POS – New order";

  const options = {
    body:
      (payload.notification && payload.notification.body) ||
      data.body || "A new order has been received.",
    icon: "./icons/pos-192.png",
    badge: "./icons/pos-192.png",
    data: { url: self.registration.scope }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target =
    event.notification.data?.url || self.registration.scope;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(list => {
        for (const client of list) {
          if ("focus" in client) return client.focus();
        }
        return clients.openWindow(target);
      })
  );
});

const CACHE = "ruz-pos-shell-v3";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./config.js",
  "./icons/pos-192.png",
  "./icons/pos-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
