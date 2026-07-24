const CACHE_NAME = "ovc-v0.1-cache";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",

    // GIFs
    "./assets/gifs/calling.gif",
    "./assets/gifs/celebrating.gif",
    "./assets/gifs/confused.gif",
    "./assets/gifs/connectionlost.gif",
    "./assets/gifs/dancing.gif",
    "./assets/gifs/excited.gif",
    "./assets/gifs/goodbye.gif",
    "./assets/gifs/laughing.gif",
    "./assets/gifs/shocked.gif",
    "./assets/gifs/success.gif",
    "./assets/gifs/talking.gif",
    "./assets/gifs/thinking.gif",
    "./assets/gifs/welcome.gif",

    // PWA icons
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];


/* =========================================
   INSTALL SERVICE WORKER
========================================= */

self.addEventListener("install", (event) => {

    console.log("OVC Service Worker: Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then((cache) => {

                console.log(
                    "OVC: Caching application files..."
                );

                return cache.addAll(
                    FILES_TO_CACHE
                );

            })

    );

    // Activate immediately
    self.skipWaiting();

});


/* =========================================
   ACTIVATE SERVICE WORKER
========================================= */

self.addEventListener("activate", (event) => {

    console.log(
        "OVC Service Worker: Activated"
    );

    event.waitUntil(

        caches.keys()

            .then((cacheNames) => {

                return Promise.all(

                    cacheNames.map(
                        (cacheName) => {

                            // Delete old OVC caches
                            if (
                                cacheName !==
                                CACHE_NAME
                            ) {

                                console.log(
                                    "OVC: Removing old cache:",
                                    cacheName
                                );

                                return caches.delete(
                                    cacheName
                                );

                            }

                        }
                    )

                );

            })

    );

    // Take control of open pages
    self.clients.claim();

});


/* =========================================
   FETCH
========================================= */

self.addEventListener("fetch", (event) => {

    // Only handle HTTP and HTTPS requests
    if (
        event.request.url.startsWith("http://") ||
        event.request.url.startsWith("https://")
    ) {

        event.respondWith(

            caches.match(event.request)

                .then((cachedResponse) => {

                    // Return cached file if available
                    if (cachedResponse) {

                        return cachedResponse;

                    }

                    // Otherwise get it from network
                    return fetch(event.request);

                })

        );

    }

});