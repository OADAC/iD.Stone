/* App shell only. PDF is available online/downloaded separately. */
const CACHE='idstone-explorer-v1';
const SHELL=['./','./index.html','./styles.css','./app.js','./assets/hero.webp','./assets/slab.webp','./assets/architecture.webp','./assets/collection.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('idstone-explorer-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin||new URL(e.request.url).pathname.endsWith('.pdf'))return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));});
