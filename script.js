/* =========================================================
   OVC v0.1
   OFFLINE VIDEO CALLING
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const login =
    document.getElementById("login");

const usernameInput =
    document.getElementById("username");

const genderInput =
    document.getElementById("gender");

const sendButton =
    document.getElementById("send");

const loginGif =
    document.getElementById("login-gif");

const botMessage =
    document.getElementById("bot-message");

const videoLayout =
    document.getElementById("videolayout");

const welcomeUser =
    document.getElementById("welcome-user");

const userAvatar =
    document.getElementById("user-avatar");

const statusGif =
    document.getElementById("status-gif");

const statusTitle =
    document.getElementById("status-title");

const statusText =
    document.getElementById("status-text");

const findUsersButton =
    document.getElementById("find-users");

const statusButton =
    document.getElementById("status-button");

const logoutButton =
    document.getElementById("logout-button");

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toast-icon");

const toastMessage =
    document.getElementById("toast-message");



/* =========================================================
   USER AVATARS
========================================================= */

const user_profile_boy_images = [

    "🧑‍🎄",
    "🕵️‍♂️",
    "💂‍♂️",
    "🥷",
    "👨‍🎓",
    "🧑‍🚀",
    "🧙‍♂️"

];


const user_profile_girl_images = [

    "👩‍🎄",
    "🕵️‍♀️",
    "💂‍♀️",
    "🥷",
    "👩‍🎓",
    "🧑‍🚀",
    "🧙‍♀️"

];



/* =========================================================
   GIF PATHS
========================================================= */

const gifs = {

    welcome:
        "assets/gifs/welcome.gif",

    thinking:
        "assets/gifs/thinking.gif",

    calling:
        "assets/gifs/calling.gif",

    talking:
        "assets/gifs/talking.gif",

    connectionlost:
        "assets/gifs/connectionlost.gif",

    success:
        "assets/gifs/success.gif",

    goodbye:
        "assets/gifs/goodbye.gif",

    confused:
        "assets/gifs/confused.gif",

    dancing:
        "assets/gifs/dancing.gif",

    celebrating:
        "assets/gifs/celebrating.gif",

    excited:
        "assets/gifs/excited.gif",

    laughing:
        "assets/gifs/laughing.gif",

    shocked:
        "assets/gifs/shocked.gif"

};



/* =========================================================
   BOT MESSAGES
========================================================= */

const messages = [

    "Hey! 👋",

    "Welcome to OVC!",

    "I'm your OVC guide 🤖",

    "No Internet? No problem! 😎",

    "Let's find someone nearby 📡",

    "Your local network is your highway 🚀",

    "Ready to communicate? 📹"

];



/* =========================================================
   APPLICATION STATE
========================================================= */

let currentUser = null;



/* =========================================================
   SHOW TOAST
========================================================= */

function showToast(
    message,
    icon = "ℹ️"
) {

    toastIcon.textContent =
        icon;

    toastMessage.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}



/* =========================================================
   CHANGE STATUS GIF
========================================================= */

function setStatus(
    gifName,
    title,
    text
) {

    statusGif.style.opacity =
        "0";


    setTimeout(
        () => {

            statusGif.src =
                gifs[gifName];


            statusGif.onload =
                () => {

                    statusGif.style.opacity =
                        "1";

                };


            statusTitle.textContent =
                title;


            statusText.textContent =
                text;

        },
        300
    );

}



/* =========================================================
   BOT MESSAGE
========================================================= */

function showBotMessage(
    message
) {

    botMessage.textContent =
        message;

}



/* =========================================================
   GENERATE USER AVATAR
========================================================= */

function generateAvatar(
    gender
) {

    let avatarList;


    if (
        gender === "female"
    ) {

        avatarList =
            user_profile_girl_images;

    } else {

        avatarList =
            user_profile_boy_images;

    }


    const randomIndex =
        Math.floor(
            Math.random()
            *
            avatarList.length
        );


    return avatarList[
        randomIndex
    ];

}



/* =========================================================
   LOGIN USER
========================================================= */

function loginUser() {

    const username =
        usernameInput.value.trim();


    const gender =
        genderInput.value;


    if (!username) {

        showToast(
            "Please enter your username.",
            "⚠️"
        );

        usernameInput.focus();

        return;

    }


    const avatar =
        generateAvatar(
            gender
        );


    currentUser = {

        username:
            username,

        gender:
            gender,

        avatar:
            avatar

    };


    /* =========================================
       SAVE USER LOCALLY
    ========================================== */

    localStorage.setItem(

        "ovc_user",

        JSON.stringify(
            currentUser
        )

    );


    /* =========================================
       HIDE LOGIN
    ========================================== */

    login.style.display =
        "none";


    /* =========================================
       SHOW MAIN APP
    ========================================== */

    videoLayout.style.display =
        "block";


    /* =========================================
       UPDATE USER UI
    ========================================== */

    welcomeUser.textContent =
        `Hello, ${username}! 👋`;


    userAvatar.textContent =
        avatar;


    /* =========================================
       INITIAL STATUS
    ========================================== */

    setStatus(

        "dancing",

        "You're ready! 🎉",

        "OVC is waiting for people on your local network."

    );


    showBotMessage(

        `Hey ${username}! Welcome to OVC 😎`

    );


    showToast(

        "Welcome to OVC!",

        "👋"

    );

}



/* =========================================================
   RESTORE USER
========================================================= */

function restoreUser() {

    const savedUser =
        localStorage.getItem(
            "ovc_user"
        );


    if (!savedUser) {

        return;

    }


    try {

        currentUser =
            JSON.parse(
                savedUser
            );


        usernameInput.value =
            currentUser.username;


        genderInput.value =
            currentUser.gender;


        welcomeUser.textContent =
            `Hello, ${currentUser.username}! 👋`;


        userAvatar.textContent =
            currentUser.avatar;


        login.style.display =
            "none";


        videoLayout.style.display =
            "block";


        setStatus(

            "dancing",

            "Welcome back! 👋",

            "OVC is ready for your next connection."

        );


    } catch (error) {

        console.error(
            "OVC: Failed to restore user",
            error
        );


        localStorage.removeItem(
            "ovc_user"
        );

    }

}



/* =========================================================
   FIND PEOPLE
========================================================= */

function findUsers() {

    setStatus(

        "thinking",

        "Looking for people... 🔍",

        "Scanning your local OVC network."

    );


    showToast(

        "Searching for OVC users...",

        "🔍"

    );


    showBotMessage(

        "Hmm... let me see who's nearby 👀"

    );


    /*
     * SIMULATION ONLY
     *
     * This is where your future LAN
     * WebRTC discovery logic will go.
     */


    setTimeout(

        () => {

            setStatus(

                "confused",

                "Nobody found yet 🤔",

                "There are currently no other OVC users available."

            );


            showBotMessage(

                "Looks like everyone is hiding today 😂"

            );

        },

        3000

    );

}



/* =========================================================
   CHECK NETWORK
========================================================= */

function checkNetwork() {

    setStatus(

        "thinking",

        "Checking network... 📡",

        "Checking your current connection status."

    );


    setTimeout(

        () => {

            setStatus(

                "success",

                "Network ready! 🟢",

                "OVC is ready to communicate with nearby devices."

            );


            showToast(

                "Network check completed.",

                "✅"

            );


            showBotMessage(

                "The network looks good! 🚀"

            );

        },

        2000

    );

}



/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    setStatus(

        "goodbye",

        "Goodbye! 👋",

        "See you next time on OVC."

    );


    showToast(

        "Logging out...",

        "👋"

    );


    setTimeout(

        () => {

            localStorage.removeItem(
                "ovc_user"
            );


            currentUser =
                null;


            videoLayout.style.display =
                "none";


            login.style.display =
                "flex";


            usernameInput.value =
                "";


            showBotMessage(

                "Welcome back! 👋"

            );


            /*
             * Keep the login GIF as welcome.gif
             */

            loginGif.src =
                gifs.welcome;

        },

        1000

    );

}



/* =========================================================
   EVENT LISTENERS
========================================================= */

sendButton.addEventListener(

    "click",

    loginUser

);


usernameInput.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key ===
            "Enter"
        ) {

            loginUser();

        }

    }

);


findUsersButton.addEventListener(

    "click",

    findUsers

);


statusButton.addEventListener(

    "click",

    checkNetwork

);


logoutButton.addEventListener(

    "click",

    logoutUser

);



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        restoreUser();

    }

);



/* =========================================================
   PWA INSTALLATION
========================================================= */

let deferredPrompt =
    null;


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



window.addEventListener(

    "beforeinstallprompt",

    (event) => {

        event.preventDefault();


        deferredPrompt =
            event;


        installPrompt.classList.add(
            "show"
        );

    }

);



installButton.addEventListener(

    "click",

    async () => {

        if (!deferredPrompt) {

            return;

        }


        deferredPrompt.prompt();


        const result =
            await deferredPrompt.userChoice;


        console.log(

            "OVC Install:",
            result.outcome

        );


        deferredPrompt =
            null;


        installPrompt.classList.remove(
            "show"
        );

    }

);



closeInstall.addEventListener(

    "click",

    () => {

        installPrompt.classList.remove(
            "show"
        );

    }

);



window.addEventListener(

    "appinstalled",

    () => {

        console.log(
            "OVC installed successfully."
        );


        installPrompt.classList.remove(
            "show"
        );


        showToast(

            "OVC installed successfully!",

            "📱"

        );

    }

);



/* =========================================================
   SERVICE WORKER
========================================================= */

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