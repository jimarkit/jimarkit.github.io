let strCache = "v5";

let listResources = [
    "./",
    "./icon.png",
    "./index.html",
    "./style.css",
    "./script.js",
]
// =====================================================
// install
const CacheResources = async (listResources) => 
{
    const objCache = await caches.open(strCache);
    await objCache.addAll(listResources);
};
  
self.addEventListener("install", (event) => 
{
    event.waitUntil(CacheResources(listResources));
});
// =====================================================

// =====================================================
// activate
const EnableNavigationPreload = async () => 
{
    if (self.registration.navigationPreload) 
    {
        await self.registration.navigationPreload.enable();
    }
};
  
const DeleteCache = async (key) => 
{
    await caches.delete(key);
};
  
const DeleteOldCaches = async () => 
{
    const listKeep = [strCache];
    const listKey = await caches.keys();
    const listDelete = listKey.filter((key) => !listKeep.includes(key));
    await Promise.all(listDelete.map(DeleteCache));
};
  
self.addEventListener("activate", (event) => 
{
    event.waitUntil(EnableNavigationPreload());
    event.waitUntil(DeleteOldCaches());
});
// =====================================================

// =====================================================
// fetch
const CacheSingleResource = async (request, response) => 
{
    const objCache = await caches.open(strCache);
    await objCache.put(request, response);
};

const Fetch = async ({request, responsePromise, responseFallback}) => 
{
    const responseFromCache = await caches.match(request);
    if (responseFromCache) 
    {
        return responseFromCache;
    }
  
    const responseFromPreload = await responsePromise;
    if (responseFromPreload) 
    {
        CacheSingleResource(request, responseFromPreload.clone());
        return responseFromPreload;
    }
  
    try 
    {
        const responseFromNetwork = await fetch(request.clone());
        CacheSingleResource(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } 
    catch (error) 
    {
        console.log(`Service worker failed with ${error}`)
        const responseFromFallback = await caches.match(responseFallback);
        if (responseFromFallback) 
        {
            return responseFromFallback;
        }
        return new Response("Request timeout", {
            status: 408,
            headers: {"Content-Type": "text/plain"},
        });
    }
};
  
self.addEventListener("fetch", (event) => 
{
    event.respondWith(Fetch({
            request: event.request,
            responsePromise: event.preloadResponse,
            responseFallback: "./index.html",
        })
    );
});
// =====================================================
