// Καλή Μέρα μου – service worker. Έκδοση 13-10-2026 10:40
// Η σελίδα φέρνει πάντα πρώτα τη νέα έκδοση από το ίντερνετ· χωρίς σύνδεση, δείχνει την αποθηκευμένη.
const CACHE = "kalimera-v8";
const FILES = ["./", "index.html", "data.json", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Μόνο αρχεία της εφαρμογής· τα εξωτερικά (π.χ. υπογραφή) τα αφήνουμε στον browser
  // Only the app's own files; external ones (e.g. the signature) are left to the browser
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request).then(r => r || (e.request.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
