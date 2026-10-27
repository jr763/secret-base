/* 秘密基地 offline cache: always try the network first, fall back to the saved copy */
var C="sb-v1";
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-180.png"]).catch(function(){})}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
  if(u.pathname.endsWith("version.json"))return;
  if(u.origin===location.origin){e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r.mode==="navigate"?"index.html":r,cp)})}return res}).catch(function(){return caches.match(r.mode==="navigate"?"index.html":r,{ignoreSearch:true})}));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||/gstatic\.com$/.test(u.hostname)&&u.pathname.indexOf("/firebasejs/")===0){e.respondWith(caches.open(C).then(function(c){return c.match(r).then(function(hit){var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(function(){return hit});return hit||net})}))}
});
