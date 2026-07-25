const CACHE_NAME =
    "ovc-offline-v1";


const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./libs/qrcode.min.js",
    "./libs/html5-qrcode.min.js"
];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    cache =>
                        cache.addAll(
                            APP_FILES
                        )
                )

        );


        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    keys =>

                        Promise.all(

                            keys
                                .filter(
                                    key =>
                                        key !==
                                        CACHE_NAME
                                )

                                .map(
                                    key =>
                                        caches.delete(
                                            key
                                        )
                                )

                        )

                )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches
                .match(
                    event.request
                )

                .then(
                    cached => {

                        return (

                            cached ||

                            fetch(
                                event.request
                            )

                        );

                    }
                )

        );

    }
);