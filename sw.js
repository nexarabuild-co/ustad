const C="ustad-202611210759";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","manifest.webmanifest","icon-192.png","icon-512.png"])));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=="ustad-share").map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
 if(e.request.method==="POST"&&u.pathname.endsWith("/share-target")){e.respondWith((async()=>{try{const f=await e.request.formData();const c=await caches.open("ustad-share");const file=f.get("file");
  await c.put("share-meta",new Response(JSON.stringify({title:f.get("title")||"",text:f.get("text")||"",url:f.get("url")||"",fname:file&&file.name||"",ftype:file&&file.type||""})));
  if(file&&file.size) await c.put("share-file",new Response(file,{headers:{"Content-Type":file.type||"application/octet-stream"}})); else await c.delete("share-file");}catch(err){}
  return Response.redirect(new URL("./?share=1",self.registration.scope).href,303);})());return;}
 if(e.request.method!=="GET"||u.origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./"))));});
