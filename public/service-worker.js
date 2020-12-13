const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./js/index.js",
  "./css/styles.css",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png",
];

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("  || Cache installing : " + CACHE_NAME + " ||   ");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Delete old caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("   || Cache deleting : " + keyList[i] + " ||   ");
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// Listen in on fetch requests and take action if necessary
self.addEventListener("fetch", function (evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              // If response is OK, clone & store in cache
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch((err) => {
              // If Network fails, retrieve from cache
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );

    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(function () {
      return caches.match(evt.request).then(function (response) {
        if (response) {
          return response;
        } else if (evt.request.headers.get("accept").includes("text/html")) {
          // Returns homepage for all requests of all HTML pages
          return caches.match("/");
        }
      });
    })
  );
});
