// Service worker ArchiGest DZ : fichiers du site d'abord depuis le réseau (les mises à jour apparaissent tout de suite),
// copie en cache pour le mode hors ligne. Changer V pour vider l'ancien cache.
const V="archigest-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(["./","index.html","style.css","core.js","import-backup.js","views.js","bootstrap.js","manifest.webmanifest","favicon.png","icon-192.png","icon-512.png","apple-touch-icon.png"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const keep=(r,res)=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))};
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
if(u.origin===location.origin){e.respondWith(fetch(r).then(res=>{if(res.ok)keep(r,res);return res}).catch(()=>caches.match(r).then(h=>h||caches.match("index.html"))))}
else if(u.hostname==="cdnjs.cloudflare.com"){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{keep(r,res);return res})))}});
