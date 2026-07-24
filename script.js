/* =========================================
   OVC - OFFLINE VIDEO COMMUNICATION
   Main Frontend Script
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const name = document.getElementById("username");
const gender = document.getElementById("gender");
const send = document.getElementById("send");

const videolayout = document.getElementById("video-layout");

const login = document.querySelector(".login");
const dashboard = document.getElementById("dashboard");

const profileName = document.getElementById("profile-name");

const loginGif = document.getElementById("login-gif");
const botMessage = document.getElementById("bot-message");

const funnyMessage = document.getElementById("funny-message");
const funnyMessageText = document.getElementById("funny-message-text");
const closeMessage = document.getElementById("close-message");

const usersList = document.getElementById("users-list");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const toastIcon = document.getElementById("toast-icon");


/* =========================================
   USER PROFILE AVATARS
========================================= */

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


/* =========================================
   OVC GIFS
========================================= */

const gifs = [
    "assets/gifs/calling.gif",
    "assets/gifs/celebrating.gif",
    "assets/gifs/confused.gif",
    "assets/gifs/connectionlost.gif",
    "assets/gifs/dancing.gif",
    "assets/gifs/excited.gif",
    "assets/gifs/goodbye.gif",
    "assets/gifs/laughing.gif",
    "assets/gifs/shocked.gif",
    "assets/gifs/success.gif",
    "assets/gifs/talking.gif",
    "assets/gifs/thinking.gif",
    "assets/gifs/welcome.gif"
];


/* =========================================
   OVC FUNNY MESSAGES
========================================= */

const funnyMessages = [

    "Nobody is online... suspicious. 👀",

    "Did everyone go for chai? ☕",

    "I'm looking for humans... still looking... 👀",

    "The network is alive. The people? Not so much. 😂",

    "Someone should probably call someone. 📞",

    "It's quiet here... suspiciously quiet. 🤨",

    "No calls yet. My phone is feeling lonely. 😭",

    "I detected absolutely nothing. Impressive. 🫡",

    "Waiting for someone to appear... 👻",

    "Maybe everyone is hiding from OVC. 😂",

    "Your friends are somewhere... probably. 👀",

    "OVC is ready. Are you? 😎",

    "Let's find someone to bother. 😈",

    "The network is watching... 👁️",

    "You could call someone, you know. 📞"

];


/* =========================================
   OVC BOT MESSAGES
========================================= */

const messages = [

    "Hey! 👋",

    "Welcome to OVC!",

    "I'm your OVC guide 🤖",

    "We communicate without the Internet 😎",

    "First, tell me your name!"

];


/* =========================================
   APPLICATION STATE
========================================= */

let inCall = false;

let currentUser = null;

let personalityTimer = null;

let funnyMessageTimer = null;

let botMessageIndex = 0;


/* =========================================
   INITIALIZE OVC
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeOVC();

    }
);


/* =========================================
   INITIALIZE APPLICATION
========================================= */

function initializeOVC() {

    const savedUser =
        localStorage.getItem("ovc_user");

    if (savedUser) {

        try {

            currentUser =
                JSON.parse(savedUser);

            showDashboard();

        } catch (error) {

            console.error(
                "Invalid saved OVC user",
                error
            );

            localStorage.removeItem(
                "ovc_user"
            );

            showLogin();

        }

    } else {

        showLogin();

        startBotMessages();

    }

}


/* =========================================
   SHOW LOGIN
========================================= */

function showLogin() {

    if (login) {

        login.style.display = "flex";

    }

    if (dashboard) {

        dashboard.style.display = "none";

    }

    if (videolayout) {

        videolayout.style.display = "none";

    }

}


/* =========================================
   SHOW DASHBOARD
========================================= */

function showDashboard() {

    if (login) {

        login.style.display = "none";

    }

    if (dashboard) {

        dashboard.style.display = "block";

    }

    if (videolayout) {

        videolayout.style.display = "none";

    }

    if (currentUser) {

        profileName.textContent =
            currentUser.name;

    }

    startPersonalitySystem();

}


/* =========================================
   LOGIN BUTTON
========================================= */

if (send) {

    send.addEventListener(
        "click",
        createUserProfile
    );

}


/* =========================================
   ENTER KEY LOGIN
========================================= */

if (name) {

    name.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                createUserProfile();

            }

        }
    );

}


/* =========================================
   CREATE USER PROFILE
========================================= */

function createUserProfile() {

    const username =
        name.value.trim();

    if (!username) {

        showToast(
            "Please enter your name 😄",
            "⚠️"
        );

        name.focus();

        return;

    }


    const selectedGender =
        gender.value;


    let avatar;


    if (
        selectedGender === "female"
    ) {

        avatar =
            getRandomItem(
                user_profile_girl_images
            );

    } else {

        avatar =
            getRandomItem(
                user_profile_boy_images
            );

    }


    /*
       Generate a local OVC ID.

       This is NOT yet a network identity.
       We will later connect this with
       QR and peer discovery.
    */

    const ovcId =
        generateOVCId();


    currentUser = {

        name: username,

        gender: selectedGender,

        avatar: avatar,

        ovcId: ovcId,

        createdAt:
            Date.now()

    };


    /*
       Save user locally.

       This means the user does not
       have to enter their name again.
    */

    localStorage.setItem(

        "ovc_user",

        JSON.stringify(
            currentUser
        )

    );


    /*
       Update dashboard.
    */

    profileName.textContent =
        username;


    showToast(
        `Welcome to OVC, ${username}! 🎉`,
        "👋"
    );


    /*
       Open dashboard after
       short delay.
    */

    setTimeout(
        () => {

            showDashboard();

        },
        500
    );

}


/* =========================================
   GENERATE OVC USER ID
========================================= */

function generateOVCId() {

    const randomPart =
        Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `OVC-${randomPart}`;

}


/* =========================================
   RANDOM ITEM
========================================= */

function getRandomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================================
   BOT MESSAGE SYSTEM
========================================= */

function startBotMessages() {

    if (!botMessage) {

        return;

    }


    botMessageIndex = 0;


    function showNextMessage() {

        if (
            botMessageIndex >=
            messages.length
        ) {

            return;

        }


        botMessage.style.opacity =
            "0";


        setTimeout(
            () => {

                botMessage.textContent =
                    messages[
                        botMessageIndex
                    ];

                botMessage.style.opacity =
                    "1";

                botMessageIndex++;

            },
            300
        );

    }


    showNextMessage();


    const botInterval =
        setInterval(
            () => {

                if (
                    botMessageIndex >=
                    messages.length
                ) {

                    clearInterval(
                        botInterval
                    );

                    return;

                }

                showNextMessage();

            },
            2500
        );

}


/* =========================================
   PERSONALITY SYSTEM
========================================= */

function startPersonalitySystem() {

    /*
       Stop existing timers.
    */

    stopPersonalitySystem();


    /*
       Do not run personality
       system during calls.
    */

    if (inCall) {

        return;

    }


    /*
       Show first personality
       after 5 seconds.
    */

    personalityTimer = setTimeout(
        () => {

            showRandomPersonality();

        },
        5000
    );


    /*
       Funny messages appear
       independently.
    */

    funnyMessageTimer =
        setTimeout(
            () => {

                showFunnyMessage();

            },
            8000
        );

}


/* =========================================
   STOP PERSONALITY SYSTEM
========================================= */

function stopPersonalitySystem() {

    if (personalityTimer) {

        clearTimeout(
            personalityTimer
        );

        personalityTimer = null;

    }


    if (funnyMessageTimer) {

        clearTimeout(
            funnyMessageTimer
        );

        funnyMessageTimer = null;

    }


    hideFunnyMessage();

}


/* =========================================
   SHOW RANDOM GIF
========================================= */

function showRandomPersonality() {

    /*
       Never show GIF while
       user is in a call.
    */

    if (inCall) {

        return;

    }


    if (!loginGif) {

        return;

    }


    const randomGif =
        getRandomItem(gifs);


    /*
       Restart animation.
    */

    loginGif.style.animation =
        "none";


    void loginGif.offsetWidth;


    loginGif.src =
        randomGif;


    loginGif.style.animation =
        "gif-fade 0.8s ease";


    /*
       Schedule next GIF.
    */

    personalityTimer =
        setTimeout(

            showRandomPersonality,

            randomNumber(
                30000,
                60000
            )

        );

}


/* =========================================
   SHOW FUNNY MESSAGE
========================================= */

function showFunnyMessage() {

    if (inCall) {

        return;

    }


    if (
        !funnyMessage ||
        !funnyMessageText
    ) {

        return;

    }


    const message =
        getRandomItem(
            funnyMessages
        );


    funnyMessageText.textContent =
        message;


    funnyMessage.classList.add(
        "show"
    );


    /*
       Automatically hide after
       6 seconds.
    */

    setTimeout(
        () => {

            hideFunnyMessage();

        },
        6000
    );


    /*
       Schedule next message.
    */

    funnyMessageTimer =
        setTimeout(

            showFunnyMessage,

            randomNumber(
                30000,
                60000
            )

        );

}


/* =========================================
   HIDE FUNNY MESSAGE
========================================= */

function hideFunnyMessage() {

    if (funnyMessage) {

        funnyMessage.classList.remove(
            "show"
        );

    }

}


/* =========================================
   CLOSE MESSAGE
========================================= */

if (closeMessage) {

    closeMessage.addEventListener(
        "click",
        () => {

            hideFunnyMessage();

        }
    );

}


/* =========================================
   RANDOM NUMBER
========================================= */

function randomNumber(
    min,
    max
) {

    return Math.floor(

        Math.random() *
        (max - min + 1)

    ) + min;

}


/* =========================================
   TOAST SYSTEM
========================================= */

function showToast(
    message,
    icon = "ℹ️"
) {

    if (
        !toast ||
        !toastMessage
    ) {

        return;

    }


    toastMessage.textContent =
        message;

    toastIcon.textContent =
        icon;


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


/* =========================================
   QR SCANNER
========================================= */

const scanQR =
    document.getElementById(
        "scan-qr"
    );

const mobileScan =
    document.getElementById(
        "mobile-scan"
    );


function openQRScanner() {

    showToast(
        "QR Scanner coming next! 🔳",
        "📱"
    );

}


if (scanQR) {

    scanQR.addEventListener(
        "click",
        openQRScanner
    );

}


if (mobileScan) {

    mobileScan.addEventListener(
        "click",
        openQRScanner
    );

}


/* =========================================
   MY QR
========================================= */

const myQR =
    document.getElementById(
        "my-qr"
    );

const myQRAction =
    document.getElementById(
        "my-qr-action"
    );


function showMyQR() {

    if (!currentUser) {

        return;

    }


    showToast(

        `Your OVC ID is ${currentUser.ovcId}`,

        "🔳"

    );

}


if (myQR) {

    myQR.addEventListener(
        "click",
        showMyQR
    );

}


if (myQRAction) {

    myQRAction.addEventListener(
        "click",
        showMyQR
    );

}


/* =========================================
   REFRESH NETWORK
========================================= */

const refreshNetwork =
    document.getElementById(
        "refresh-network"
    );

const refreshUsers =
    document.getElementById(
        "refresh-users"
    );


function refreshOVCNetwork() {

    showToast(

        "Scanning the OVC network... 🔍",

        "📡"

    );

}


if (refreshNetwork) {

    refreshNetwork.addEventListener(

        "click",

        refreshOVCNetwork

    );

}


if (refreshUsers) {

    refreshUsers.addEventListener(

        "click",

        refreshOVCNetwork

    );

}


/* =========================================
   CALL HISTORY
========================================= */

const callHistory =
    document.getElementById(
        "call-history"
    );

const mobileCalls =
    document.getElementById(
        "mobile-calls"
    );


function openCallHistory() {

    showToast(

        "Call history coming next! 📞",

        "📞"

    );

}


if (callHistory) {

    callHistory.addEventListener(

        "click",

        openCallHistory

    );

}


if (mobileCalls) {

    mobileCalls.addEventListener(

        "click",

        openCallHistory

    );

}


/* =========================================
   START VIDEO CALL
========================================= */

function startCall(
    userName = "User"
) {

    /*
       Change application state.
    */

    inCall = true;


    /*
       Stop all personality animations.
    */

    stopPersonalitySystem();


    /*
       Hide dashboard.
    */

    if (dashboard) {

        dashboard.style.display =
            "none";

    }


    /*
       Hide login.
    */

    if (login) {

        login.style.display =
            "none";

    }


    /*
       Show video layout.
    */

    if (videolayout) {

        videolayout.style.display =
            "block";

    }


    /*
       Update call user.
    */

    const videoUserName =
        document.querySelector(
            ".remote-video .video-user-name"
        );


    if (videoUserName) {

        videoUserName.textContent =
            userName;

    }


    showToast(

        `Calling ${userName}... 📞`,

        "📹"

    );

}


/* =========================================
   END CALL
========================================= */

const endCall =
    document.getElementById(
        "end-call"
    );


function endCurrentCall() {

    /*
       Change state.
    */

    inCall = false;


    /*
       Hide video call.
    */

    if (videolayout) {

        videolayout.style.display =
            "none";

    }


    /*
       Show dashboard.
    */

    if (dashboard) {

        dashboard.style.display =
            "block";

    }


    showToast(

        "Call ended 👋",

        "📞"

    );


    /*
       Restart personality
       system after call.
    */

    setTimeout(

        () => {

            startPersonalitySystem();

        },

        5000

    );

}


if (endCall) {

    endCall.addEventListener(

        "click",

        endCurrentCall

    );

}


/* =========================================
   CALL BUTTONS
========================================= */

document.addEventListener(

    "click",

    (event) => {

        const callButton =
            event.target.closest(
                ".call-button"
            );


        if (!callButton) {

            return;

        }


        const userCard =
            callButton.closest(
                ".user-card"
            );


        if (!userCard) {

            return;

        }


        const userNameElement =
            userCard.querySelector(
                ".user-info h3"
            );


        const userName =
            userNameElement
                ? userNameElement.textContent
                : "User";


        startCall(
            userName
        );

    }

);


/* =========================================
   PROFILE BUTTON
========================================= */

const profileButton =
    document.getElementById(
        "profile-button"
    );


if (profileButton) {

    profileButton.addEventListener(

        "click",

        () => {

            if (!currentUser) {

                return;

            }


            showToast(

                `${currentUser.name} • ${currentUser.ovcId}`,

                currentUser.avatar

            );

        }

    );

}


/* =========================================
   SETTINGS
========================================= */

const settingsButton =
    document.getElementById(
        "settings-button"
    );

const mobileSettings =
    document.getElementById(
        "mobile-settings"
    );


function openSettings() {

    showToast(

        "Settings coming soon! ⚙️",

        "⚙️"

    );

}


if (settingsButton) {

    settingsButton.addEventListener(

        "click",

        openSettings

    );

}


if (mobileSettings) {

    mobileSettings.addEventListener(

        "click",

        openSettings

    );

}


/* =========================================
   MOBILE NAVIGATION
========================================= */

const mobileNavigation =
    document.querySelector(
        ".mobile-navigation"
    );


if (mobileNavigation) {

    const navButtons =
        mobileNavigation.querySelectorAll(
            "button"
        );


    navButtons.forEach(

        (button) => {

            button.addEventListener(

                "click",

                () => {

                    navButtons.forEach(

                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        }

                    );


                    button.classList.add(
                        "active"
                    );

                }

            );

        }

    );

}


/* =========================================
   CAMERA / MICROPHONE CONTROLS
========================================= */

const muteButton =
    document.getElementById(
        "mute-button"
    );

const cameraButton =
    document.getElementById(
        "camera-button"
    );


let microphoneMuted = false;

let cameraDisabled = false;


if (muteButton) {

    muteButton.addEventListener(

        "click",

        () => {

            microphoneMuted =
                !microphoneMuted;


            muteButton.textContent =

                microphoneMuted

                    ? "🔇"

                    : "🎙️";


            showToast(

                microphoneMuted

                    ? "Microphone muted 🔇"

                    : "Microphone enabled 🎙️",

                microphoneMuted

                    ? "🔇"

                    : "🎙️"

            );

        }

    );

}


if (cameraButton) {

    cameraButton.addEventListener(

        "click",

        () => {

            cameraDisabled =
                !cameraDisabled;


            cameraButton.textContent =

                cameraDisabled

                    ? "🚫"

                    : "📹";


            showToast(

                cameraDisabled

                    ? "Camera disabled 🚫"

                    : "Camera enabled 📹",

                cameraDisabled

                    ? "🚫"
                    : "📹"

            );

        }

    );

}


/* =========================================
   BEFORE UNLOAD
========================================= */

window.addEventListener(

    "beforeunload",

    () => {

        /*
           We intentionally keep the
           user profile in localStorage.

           This allows OVC to remember
           the user when the PWA is
           reopened offline.
        */

    }

);