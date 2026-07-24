/* =========================================
   OVC PWA INSTALLATION SYSTEM
========================================= */


/*
   Stores the browser's
   installation event.
*/

let deferredInstallPrompt = null;


/*
   Install UI elements.
*/

const installPrompt =
    document.getElementById(
        "install-prompt"
    );


const installButton =
    document.getElementById(
        "install-button"
    );


const closeInstall =
    document.getElementById(
        "close-install"
    );


/* =========================================
   PWA INSTALL EVENT
========================================= */

window.addEventListener(

    "beforeinstallprompt",

    (event) => {

        /*
           Prevent Chrome from
           showing its default prompt.
        */

        event.preventDefault();


        /*
           Save the event.

           We will use it when
           the user clicks Install.
        */

        deferredInstallPrompt =
            event;


        console.log(
            "OVC can be installed"
        );


        /*
           Show our custom
           install prompt.
        */

        setTimeout(

            () => {

                if (
                    installPrompt
                ) {

                    installPrompt
                        .classList
                        .add("show");

                }

            },

            3000

        );

    }

);


/* =========================================
   INSTALL BUTTON
========================================= */

if (installButton) {

    installButton.addEventListener(

        "click",

        async () => {

            /*
               Make sure the browser
               has provided an install prompt.
            */

            if (
                !deferredInstallPrompt
            ) {

                console.log(
                    "Install prompt unavailable"
                );

                return;

            }


            /*
               Open browser's
               native install dialog.
            */

            deferredInstallPrompt
                .prompt();


            /*
               Wait for user decision.
            */

            const result =
                await deferredInstallPrompt
                    .userChoice;


            console.log(

                "Installation result:",

                result.outcome

            );


            /*
               Clear saved prompt.
            */

            deferredInstallPrompt =
                null;


            /*
               Hide custom prompt.
            */

            installPrompt
                .classList
                .remove("show");

        }

    );

}


/* =========================================
   CLOSE INSTALL PROMPT
========================================= */

if (closeInstall) {

    closeInstall.addEventListener(

        "click",

        () => {

            installPrompt
                .classList
                .remove("show");


            /*
               Remember that user
               closed the prompt.

               Don't show it again
               during this session.
            */

            sessionStorage.setItem(

                "ovc_install_dismissed",

                "true"

            );

        }

    );

}


/* =========================================
   HIDE IF ALREADY INSTALLED
========================================= */

window.addEventListener(

    "appinstalled",

    () => {

        console.log(
            "OVC installed successfully"
        );


        deferredInstallPrompt =
            null;


        if (installPrompt) {

            installPrompt
                .classList
                .remove("show");

        }

    }

);


/* =========================================
   CHECK STANDALONE MODE
========================================= */

function isOVCInstalled() {

    return (

        window.matchMedia(
            "(display-mode: standalone)"
        ).matches

        ||

        window.navigator.standalone === true

    );

}


/* =========================================
   REGISTER SERVICE WORKER
========================================= */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(

        "load",

        () => {

            navigator.serviceWorker
                .register(
                    "sw.js"
                )

                .then(

                    (registration) => {

                        console.log(

                            "OVC Service Worker registered:",

                            registration.scope

                        );

                    }

                )

                .catch(

                    (error) => {

                        console.error(

                            "OVC Service Worker registration failed:",

                            error

                        );

                    }

                );

        }

    );

}