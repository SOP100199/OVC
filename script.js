
/* =====================================================
   OVC — OFFLINE VIDEO COMMUNICATION
   BACKEND-FREE CLIENT
   VERSION 1.0
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const OVC_VERSION = "1.0.0";

const STORAGE_KEY = "ovc-user";

const SETTINGS_KEY = "ovc-settings";

const PEOPLE_STORAGE_KEY = "ovc-people";

let deferredInstallPrompt = null;

const installPrompt =
    document.getElementById("install-prompt");

const installButton =
    document.getElementById("install-button");

const closeInstall =
    document.getElementById("close-install");

/* =====================================================
   DOM
===================================================== */

const nameInput =
    document.getElementById("username");

const genderInput =
    document.getElementById("gender");

const send =
    document.getElementById("send");

const loginSection =
    document.getElementById("login-section");

const mainContent =
    document.getElementById("main-content");


const navProfile =
    document.getElementById("nav-profile");

const navItems =
    document.querySelectorAll(".nav-item");

const bottomNavItems =
    document.querySelectorAll(".bottom-nav-item");

const sections =
    document.querySelectorAll(".page-section");


const homeUsername =
    document.getElementById("home-username");

const profileUsername =
    document.getElementById("profile-username");

const qrUsername =
    document.getElementById("qr-username");

const homeAvatar =
    document.getElementById("home-avatar");

const profileAvatar =
    document.getElementById("profile-avatar");

const qrAvatar =
    document.getElementById("qr-avatar");


const loginGif =
    document.getElementById("login-gif");

const statusGif =
    document.getElementById("status-gif");

const callGif =
    document.getElementById("call-gif");

const botMessage =
    document.getElementById("bot-message");

const homeBotMessage =
    document.getElementById("home-bot-message");


/* QR */

const qrCode =
    document.getElementById("qr-code");

const myQrTab =
    document.getElementById("my-qr-tab");

const scanQrTab =
    document.getElementById("scan-qr-tab");

const myQrPanel =
    document.getElementById("my-qr-panel");

const scanQrPanel =
    document.getElementById("scan-qr-panel");

const startScan =
    document.getElementById("start-scan");

const shareQr =
    document.getElementById("share-qr");

const downloadQr =
    document.getElementById("download-qr");

const qrScannerPanel =
    document.getElementById("qr-scanner-panel");

const qrReader =
    document.getElementById("qr-reader");

const closeScanner =
    document.getElementById("close-scanner");

const cancelScanner =
    document.getElementById("cancel-scanner");

const scanResult =
    document.getElementById("scan-result");


/* People */

const peopleList =
    document.getElementById("people-list");

const emptyPeople =
    document.getElementById("empty-people");


/* Video */

const videoSection =
    document.getElementById("video-section");

const localVideo =
    document.getElementById("local-video");

const remoteVideo =
    document.getElementById("remote-video");

const localPlaceholder =
    document.getElementById("local-placeholder");

const remotePlaceholder =
    document.getElementById("remote-placeholder");

const remoteUsername =
    document.getElementById("remote-username");

const callStatus =
    document.getElementById("call-status");

const callTimer =
    document.getElementById("call-timer");

const muteButton =
    document.getElementById("mute-button");

const cameraButton =
    document.getElementById("camera-button");

const endCallButton =
    document.getElementById("end-call-button");

const fullscreenButton =
    document.getElementById("fullscreen-button");


/* Modals */

const incomingCallModal =
    document.getElementById("incoming-call-modal");

const callerName =
    document.getElementById("caller-name");

const acceptCall =
    document.getElementById("accept-call");

const rejectCall =
    document.getElementById("reject-call");


const connectionModal =
    document.getElementById("connection-modal");

const connectionUserName =
    document.getElementById("connection-user-name");

const connectionUserAvatar =
    document.getElementById("connection-user-avatar");

const closeConnectionModal =
    document.getElementById("close-connection-modal");

const rejectConnection =
    document.getElementById("reject-connection");

const acceptConnection =
    document.getElementById("accept-connection");


/* Settings */

const vibrationToggle =
    document.getElementById("vibration-toggle");

const notificationToggle =
    document.getElementById("notification-toggle");

const gifToggle =
    document.getElementById("gif-toggle");

const clearData =
    document.getElementById("clear-data");

const editProfile =
    document.getElementById("edit-profile");


/* Toast */

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toast-icon");

const toastMessage =
    document.getElementById("toast-message");


/* =====================================================
   GIFS
===================================================== */

const gifs = {

    welcome:
        "assets/gifs/welcome.gif",

    calling:
        "assets/gifs/calling.gif",

    success:
        "assets/gifs/success.gif",

    connectionlost:
        "assets/gifs/connectionlost.gif",

    goodbye:
        "assets/gifs/goodbye.gif"

};


/* =====================================================
   STATE
===================================================== */

let currentUser = null;

let people = [];

let currentSettings = {

    vibration: true,

    notifications: true,

    gifs: true

};


let qrScanner = null;

let localStream = null;

let remoteStream = null;

let peerConnection = null;

let callStartTime = null;

let callTimerInterval = null;

let currentConnectionUser = null;

let isMuted = false;

let isCameraOff = false;


/* =====================================================
   AVATARS
===================================================== */

const maleAvatars = [

    "👨‍🎓",

    "🧑‍🚀",

    "🧙‍♂️",

    "🥷",

    "🕵️‍♂️",

    "💂‍♂️"

];


const femaleAvatars = [

    "👩‍🎓",

    "🧑‍🚀",

    "🧙‍♀️",

    "🥷",

    "🕵️‍♀️",

    "💂‍♀️"

];


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeOVC
);


function initializeOVC() {

    loadSettings();

    loadStoredUser();

    loadPeople();

    setupNavigation();

    setupLogin();

    setupQRInterface();

    setupCallControls();

    setupSettings();

    setupServiceWorker();

    updateBotMessage();

}
/*
=====================================================
CAPTURE NATIVE INSTALL PROMPT
=====================================================
*/

window.addEventListener(
    "beforeinstallprompt",
    (event) => {

        console.log(
            "✅ Native PWA install prompt available"
        );

        // Stop Chrome from showing the prompt automatically
        event.preventDefault();

        // Save the event
        deferredInstallPrompt = event;

        // Keep the install card visible
        if (installPrompt) {
            installPrompt.classList.remove("hidden");
        }

    }
);


/*
=====================================================
INSTALL BUTTON
=====================================================
*/

if (installButton) {

    installButton.addEventListener(
        "click",
        async () => {

            console.log(
                "📱 Install button clicked"
            );

            /*
            =============================================
            NATIVE PWA INSTALL PROMPT AVAILABLE
            =============================================
            */

            if (deferredInstallPrompt) {

                // Show browser's native install dialog
                deferredInstallPrompt.prompt();

                // Wait for user's decision
                const choice =
                    await deferredInstallPrompt.userChoice;

                console.log(
                    "PWA installation result:",
                    choice.outcome
                );

                // Clear prompt
                deferredInstallPrompt = null;

                return;
            }


            /*
            =============================================
            PROMPT NOT AVAILABLE
            =============================================
            */

            console.log(
                "⚠️ Native install prompt unavailable"
            );

            alert(
                "OVC cannot show the automatic install prompt right now.\n\n" +
                "Open your browser menu and select " +
                "'Install OVC' or 'Add to Home Screen'."
            );

        }
    );

}


/*
=====================================================
CLOSE INSTALL CARD
=====================================================
*/

if (closeInstall) {

    closeInstall.addEventListener(
        "click",
        () => {

            if (installPrompt) {

                installPrompt.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/*
=====================================================
APP INSTALLED
=====================================================
*/

window.addEventListener(
    "appinstalled",
    () => {

        console.log(
            "✅ OVC installed successfully"
        );

        deferredInstallPrompt = null;

        if (installPrompt) {

            installPrompt.classList.add(
                "hidden"
            );

        }

    }
);

/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {

    if (send) {

        send.addEventListener(
            "click",
            loginUser
        );

    }


    if (nameInput) {

        nameInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    loginUser();

                }

            }
        );

    }

}


function loginUser() {

    if (!nameInput) {
        return;
    }


    const username =
        nameInput.value.trim();


    if (!username) {

        showToast(
            "⚠️",
            "Enter your name."
        );

        return;

    }


    const gender =
        genderInput
            ? genderInput.value
            : "male";


    const avatars =
        gender === "female"
            ? femaleAvatars
            : maleAvatars;


    const avatar =
        avatars[
            Math.floor(
                Math.random() *
                avatars.length
            )
        ];


    currentUser = {

        type:
            "OVC_USER",

        id:
            generateUserId(),

        username:
            username,

        gender:
            gender,

        avatar:
            avatar,

        createdAt:
            Date.now(),

        version:
            OVC_VERSION

    };


    saveUser();

    updateUserInterface();


    if (loginSection) {

        loginSection.classList.add(
            "hidden"
        );

    }


    if (mainContent) {

        mainContent.classList.remove(
            "hidden"
        );

    }


    showToast(
        "🎉",
        `Welcome ${username}!`
    );


    navigateTo(
        "home-section"
    );

}


function generateUserId() {

    return (

        "ovc-" +

        Date.now()
            .toString(36) +

        "-" +

        Math.random()
            .toString(36)
            .substring(2, 9)

    );

}


/* =====================================================
   USER STORAGE
===================================================== */

function saveUser() {

    if (!currentUser) {
        return;
    }


    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            currentUser
        )

    );

}


function loadStoredUser() {

    try {

        const storedUser =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!storedUser) {
            return;
        }


        currentUser =
            JSON.parse(
                storedUser
            );


        if (
            !currentUser ||
            !currentUser.username
        ) {

            currentUser = null;

            return;

        }


        updateUserInterface();


        if (loginSection) {

            loginSection.classList.add(
                "hidden"
            );

        }


        if (mainContent) {

            mainContent.classList.remove(
                "hidden"
            );

        }

    }

    catch (error) {

        console.error(
            "OVC user loading error:",
            error
        );

        localStorage.removeItem(
            STORAGE_KEY
        );

        currentUser = null;

    }

}


/* =====================================================
   USER UI
===================================================== */

function updateUserInterface() {

    if (!currentUser) {
        return;
    }


    if (homeUsername) {

        homeUsername.textContent =
            currentUser.username;

    }


    if (profileUsername) {

        profileUsername.textContent =
            currentUser.username;

    }


    if (qrUsername) {

        qrUsername.textContent =
            currentUser.username;

    }


    if (homeAvatar) {

        homeAvatar.textContent =
            currentUser.avatar;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            currentUser.avatar;

    }


    if (qrAvatar) {

        qrAvatar.textContent =
            currentUser.avatar;

    }


    generateUserQR();

}


/* =====================================================
   QR GENERATION
===================================================== */

function generateUserQR() {

    if (
        !qrCode ||
        !currentUser
    ) {

        return;

    }


    qrCode.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrCode.innerHTML =
            "<p>QR library unavailable.</p>";

        console.error(
            "QRCode library not loaded."
        );

        return;

    }


    /*
        Keep QR data SMALL.

        Do NOT put unnecessary information
        inside the QR code.
    */

    const qrData = {

        type:
            "OVC_USER",

        id:
            currentUser.id,

        username:
            currentUser.username,

        avatar:
            currentUser.avatar

    };


    const qrText =
        JSON.stringify(
            qrData
        );


    console.log(
        "Generating QR:",
        qrText
    );


    try {

        new QRCode(

            qrCode,

            {

                text:
                    qrText,

                width:
                    220,

                height:
                    220,

                correctLevel:
                    QRCode.CorrectLevel.M

            }

        );

    }

    catch (error) {

        console.error(
            "QR generation error:",
            error
        );

        qrCode.innerHTML =
            "<p>Unable to generate QR.</p>";

    }

}


/* =====================================================
   QR INTERFACE
===================================================== */

function setupQRInterface() {

    if (myQrTab) {

        myQrTab.addEventListener(
            "click",
            () => {

                myQrTab.classList.add(
                    "active"
                );

                scanQrTab.classList.remove(
                    "active"
                );

                myQrPanel.classList.add(
                    "active"
                );

                scanQrPanel.classList.remove(
                    "active"
                );

            }
        );

    }


    if (scanQrTab) {

        scanQrTab.addEventListener(
            "click",
            () => {

                scanQrTab.classList.add(
                    "active"
                );

                myQrTab.classList.remove(
                    "active"
                );

                scanQrPanel.classList.add(
                    "active"
                );

                myQrPanel.classList.remove(
                    "active"
                );

            }
        );

    }


    if (startScan) {

        startScan.addEventListener(
            "click",
            startQRScanner
        );

    }


    if (closeScanner) {

        closeScanner.addEventListener(
            "click",
            closeQRScanner
        );

    }


    if (cancelScanner) {

        cancelScanner.addEventListener(
            "click",
            closeQRScanner
        );

    }


    if (shareQr) {

        shareQr.addEventListener(
            "click",
            shareUserQR
        );

    }


    if (downloadQr) {

        downloadQr.addEventListener(
            "click",
            downloadUserQR
        );

    }

}


/* =====================================================
   QR SCANNER
===================================================== */

async function startQRScanner() {

    console.log(
        "📷 Start scanner clicked"
    );


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        showToast(
            "❌",
            "QR scanner library not loaded."
        );

        console.error(
            "Html5Qrcode is undefined."
        );

        return;

    }


    if (!qrReader) {

        console.error(
            "qr-reader element missing."
        );

        return;

    }


    if (qrScanner) {

        return;

    }


    qrScannerPanel.classList.remove(
        "hidden"
    );


    qrScanner =
        new Html5Qrcode(
            "qr-reader"
        );


    try {

        await qrScanner.start(

            {
                facingMode:
                    "environment"
            },

            {

                fps:
                    10,

                qrbox:
                    {
                        width:
                            250,

                        height:
                            250
                    }

            },

            decodedText => {

                handleQRScan(
                    decodedText
                );

            },

            () => {

                // QR not found.
                // This is normal.

            }

        );


        console.log(
            "📷 QR scanner started."
        );


        showToast(
            "📷",
            "Point camera at an OVC QR code."
        );

    }

    catch (error) {

        console.error(
            "QR scanner error:",
            error
        );


        qrScanner = null;


        showToast(
            "❌",
            "Unable to access camera."
        );

    }

}


/* =====================================================
   QR SCAN
===================================================== */

async function handleQRScan(
    decodedText
) {

    console.log(
        "📦 QR data:",
        decodedText
    );


    let userData;


    try {

        userData =
            JSON.parse(
                decodedText
            );

    }

    catch (error) {

        showToast(
            "❌",
            "Invalid QR code."
        );

        return;

    }


    if (
        !userData ||
        userData.type !==
        "OVC_USER"
    ) {

        showToast(
            "❌",
            "This is not an OVC QR code."
        );

        return;

    }


    if (
        !userData.id ||
        !userData.username
    ) {

        showToast(
            "❌",
            "Invalid OVC profile."
        );

        return;

    }


    if (
        currentUser &&
        userData.id ===
        currentUser.id
    ) {

        showToast(
            "😅",
            "That's your own QR code."
        );

        return;

    }


    await closeQRScanner();


    addPerson(
        userData
    );


    showToast(
        "✅",
        `${userData.username} added to People!`
    );

}


/* =====================================================
   STOP QR SCANNER
===================================================== */

async function closeQRScanner() {

    if (qrScanner) {

        try {

            await qrScanner.stop();

            qrScanner.clear();

        }

        catch (error) {

            console.warn(
                "QR scanner stop error:",
                error
            );

        }

        qrScanner = null;

    }


    if (qrScannerPanel) {

        qrScannerPanel.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   SHARE QR
===================================================== */

async function shareUserQR() {

    const canvas =
        qrCode
            ? qrCode.querySelector(
                "canvas"
            )
            : null;


    if (!canvas) {

        showToast(
            "⚠️",
            "QR code not ready."
        );

        return;

    }


    try {

        const blob =
            await new Promise(
                resolve =>
                    canvas.toBlob(
                        resolve,
                        "image/png"
                    )
            );


        const file =
            new File(

                [blob],

                "ovc-qr.png",

                {
                    type:
                        "image/png"
                }

            );


        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare(
                {
                    files:
                        [file]
                }
            )
        ) {

            await navigator.share(

                {
                    title:
                        "My OVC QR",

                    text:
                        "Scan my OVC QR code.",

                    files:
                        [file]
                }

            );

        }

        else {

            showToast(
                "ℹ️",
                "Sharing unavailable."
            );

        }

    }

    catch (error) {

        if (
            error.name !==
            "AbortError"
        ) {

            console.error(
                error
            );

        }

    }

}


/* =====================================================
   DOWNLOAD QR
===================================================== */

function downloadUserQR() {

    const canvas =
        qrCode
            ? qrCode.querySelector(
                "canvas"
            )
            : null;


    if (!canvas) {

        showToast(
            "⚠️",
            "QR code not ready."
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "ovc-qr.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

}


/* =====================================================
   PEOPLE
===================================================== */

function loadPeople() {

    try {

        const stored =
            localStorage.getItem(
                PEOPLE_STORAGE_KEY
            );


        people =
            stored
                ? JSON.parse(
                    stored
                )
                : [];


        renderPeople();

    }

    catch (error) {

        console.error(
            error
        );

        people = [];

    }

}


function savePeople() {

    localStorage.setItem(

        PEOPLE_STORAGE_KEY,

        JSON.stringify(
            people
        )

    );

}


function addPerson(
    user
) {

    if (
        !user ||
        !user.id
    ) {

        return;

    }


    if (
        currentUser &&
        user.id ===
        currentUser.id
    ) {

        return;

    }


    const exists =
        people.some(
            person =>
                person.id ===
                user.id
        );


    if (exists) {

        showToast(
            "👋",
            "Already connected."
        );

        return;

    }


    people.push(

        {

            id:
                user.id,

            username:
                user.username,

            avatar:
                user.avatar ||
                "👤",

            status:
                "available"

        }

    );


    savePeople();

    renderPeople();

}


function renderPeople() {

    if (!peopleList) {
        return;
    }


    peopleList.innerHTML = "";


    if (
        people.length ===
        0
    ) {

        if (emptyPeople) {

            emptyPeople.style.display =
                "flex";

        }

        return;

    }


    if (emptyPeople) {

        emptyPeople.style.display =
            "none";

    }


    people.forEach(
        person => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "person-card";


            card.innerHTML = `

                <div class="person-avatar">
                    ${escapeHTML(
                        person.avatar
                    )}
                </div>

                <div class="person-info">

                    <h3>
                        ${escapeHTML(
                            person.username
                        )}
                    </h3>

                    <span>
                        🟢 Available
                    </span>

                </div>

                <button
                    class="call-person-button"
                >
                    📹
                </button>

            `;


            peopleList.appendChild(
                card
            );


            const callButton =
                card.querySelector(
                    ".call-person-button"
                );


            callButton.addEventListener(
                "click",
                () => {

                    requestCall(
                        person
                    );

                }
            );

        }
    );

}


/* =====================================================
   CALL REQUEST MODAL
===================================================== */

function requestCall(
    user
) {

    currentConnectionUser =
        user;


    if (connectionUserName) {

        connectionUserName.textContent =
            user.username;

    }


    if (connectionUserAvatar) {

        connectionUserAvatar.textContent =
            user.avatar ||
            "👤";

    }


    connectionModal.classList.remove(
        "hidden"
    );

}


if (closeConnectionModal) {

    closeConnectionModal.addEventListener(
        "click",
        () => {

            connectionModal.classList.add(
                "hidden"
            );

        }
    );

}


if (rejectConnection) {

    rejectConnection.addEventListener(
        "click",
        () => {

            connectionModal.classList.add(
                "hidden"
            );

            currentConnectionUser =
                null;

        }
    );

}


if (acceptConnection) {

    acceptConnection.addEventListener(
        "click",
        async () => {

            connectionModal.classList.add(
                "hidden"
            );


            if (
                currentConnectionUser
            ) {

                await startCall(
                    currentConnectionUser
                );

            }

        }
    );

}


/* =====================================================
   WEBRTC
===================================================== */

const rtcConfiguration = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        }

    ]

};


async function startCall(
    user
) {

    try {

        navigateTo(
            "video-section"
        );


        remoteUsername.textContent =
            user.username;


        callStatus.textContent =
            "Opening camera...";


        await startLocalMedia();


        createPeerConnection();


        callStatus.textContent =
            "Ready";


        showToast(
            "📹",
            "Camera ready."
        );

    }

    catch (error) {

        console.error(
            "Call error:",
            error
        );


        showToast(
            "❌",
            "Camera or microphone unavailable."
        );

    }

}


/* =====================================================
   CAMERA
===================================================== */

async function startLocalMedia() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        throw new Error(
            "Camera API unavailable."
        );

    }


    localStream =
        await navigator.mediaDevices
            .getUserMedia(

                {

                    video:
                        true,

                    audio:
                        true

                }

            );


    if (localVideo) {

        localVideo.srcObject =
            localStream;

    }


    if (localPlaceholder) {

        localPlaceholder.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   PEER CONNECTION
===================================================== */

function createPeerConnection() {

    peerConnection =
        new RTCPeerConnection(
            rtcConfiguration
        );


    remoteStream =
        new MediaStream();


    remoteVideo.srcObject =
        remoteStream;


    localStream
        .getTracks()
        .forEach(
            track => {

                peerConnection.addTrack(

                    track,

                    localStream

                );

            }
        );


    peerConnection.ontrack =
        event => {

            event.streams[0]
                .getTracks()
                .forEach(
                    track => {

                        remoteStream.addTrack(
                            track
                        );

                    }
                );


            remotePlaceholder.classList.add(
                "hidden"
            );

        };


    peerConnection.onconnectionstatechange =
        () => {

            const state =
                peerConnection
                    .connectionState;


            console.log(
                "WebRTC:",
                state
            );


            if (
                state ===
                "connected"
            ) {

                callStatus.textContent =
                    "Connected 🟢";

                startCallTimer();

            }


            if (
                state ===
                "failed" ||
                state ===
                "disconnected"
            ) {

                callStatus.textContent =
                    "Connection lost";

            }

        };

}


/* =====================================================
   MUTE
===================================================== */

function toggleMute() {

    if (!localStream) {
        return;
    }


    localStream
        .getAudioTracks()
        .forEach(
            track => {

                track.enabled =
                    !track.enabled;

            }
        );


    isMuted =
        !isMuted;


    muteButton.textContent =
        isMuted
            ? "🔇"
            : "🎤";

}


/* =====================================================
   CAMERA TOGGLE
===================================================== */

function toggleCamera() {

    if (!localStream) {
        return;
    }


    localStream
        .getVideoTracks()
        .forEach(
            track => {

                track.enabled =
                    !track.enabled;

            }
        );


    isCameraOff =
        !isCameraOff;


    cameraButton.textContent =
        isCameraOff
            ? "📷"
            : "🎥";


    localPlaceholder.classList.toggle(
        "hidden",
        !isCameraOff
    );

}


/* =====================================================
   END CALL
===================================================== */

function endCall() {

    if (localStream) {

        localStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        localStream = null;

    }


    if (peerConnection) {

        peerConnection.close();

        peerConnection = null;

    }


    if (remoteVideo) {

        remoteVideo.srcObject =
            null;

    }


    stopCallTimer();


    navigateTo(
        "home-section"
    );


    showToast(
        "👋",
        "Call ended."
    );

}


/* =====================================================
   CALL TIMER
===================================================== */

function startCallTimer() {

    stopCallTimer();


    callStartTime =
        Date.now();


    callTimerInterval =
        setInterval(
            () => {

                const seconds =
                    Math.floor(

                        (

                            Date.now() -
                            callStartTime

                        ) / 1000

                    );


                const minutes =
                    Math.floor(
                        seconds / 60
                    );


                const remaining =
                    seconds % 60;


                callTimer.textContent =

                    String(
                        minutes
                    ).padStart(
                        2,
                        "0"
                    )

                    +

                    ":"

                    +

                    String(
                        remaining
                    ).padStart(
                        2,
                        "0"
                    );

            },

            1000

        );

}


function stopCallTimer() {

    clearInterval(
        callTimerInterval
    );


    callTimerInterval =
        null;


    callStartTime =
        null;


    if (callTimer) {

        callTimer.textContent =
            "00:00";

    }

}


/* =====================================================
   FULLSCREEN
===================================================== */

if (fullscreenButton) {

    fullscreenButton.addEventListener(
        "click",
        async () => {

            if (
                !document.fullscreenElement
            ) {

                await videoSection
                    .requestFullscreen();

            }

            else {

                await document
                    .exitFullscreen();

            }

        }
    );

}


/* =====================================================
   CALL CONTROLS
===================================================== */

function setupCallControls() {

    if (muteButton) {

        muteButton.addEventListener(
            "click",
            toggleMute
        );

    }


    if (cameraButton) {

        cameraButton.addEventListener(
            "click",
            toggleCamera
        );

    }


    if (endCallButton) {

        endCallButton.addEventListener(
            "click",
            endCall
        );

    }

}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    document
        .querySelectorAll(
            "[data-section]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    () => {

                        navigateTo(
                            element.dataset.section
                        );

                    }
                );

            }
        );


    if (navProfile) {

        navProfile.addEventListener(
            "click",
            () => {

                navigateTo(
                    "profile-section"
                );

            }
        );

    }

}


function navigateTo(
    sectionId
) {

    sections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (!target) {
        return;
    }


    target.classList.add(
        "active-section"
    );


    bottomNavItems.forEach(
        item => {

            item.classList.toggle(

                "active",

                item.dataset.section ===
                sectionId

            );

        }
    );


    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );

}


/* =====================================================
   SETTINGS
===================================================== */

function setupSettings() {

    if (vibrationToggle) {

        vibrationToggle.addEventListener(
            "change",
            () => {

                currentSettings.vibration =
                    vibrationToggle.checked;

                saveSettings();

            }
        );

    }


    if (notificationToggle) {

        notificationToggle.addEventListener(
            "change",
            () => {

                currentSettings.notifications =
                    notificationToggle.checked;

                saveSettings();

            }
        );

    }


    if (gifToggle) {

        gifToggle.addEventListener(
            "change",
            () => {

                currentSettings.gifs =
                    gifToggle.checked;

                saveSettings();

            }
        );

    }


    if (clearData) {

        clearData.addEventListener(
            "click",
            clearOVCData
        );

    }


    if (editProfile) {

        editProfile.addEventListener(
            "click",
            editUserProfile
        );

    }

}


function saveSettings() {

    localStorage.setItem(

        SETTINGS_KEY,

        JSON.stringify(
            currentSettings
        )

    );

}


function loadSettings() {

    try {

        const stored =
            localStorage.getItem(
                SETTINGS_KEY
            );


        if (stored) {

            currentSettings =
                {

                    ...currentSettings,

                    ...JSON.parse(
                        stored
                    )

                };

        }


        if (vibrationToggle) {

            vibrationToggle.checked =
                currentSettings.vibration;

        }


        if (notificationToggle) {

            notificationToggle.checked =
                currentSettings.notifications;

        }


        if (gifToggle) {

            gifToggle.checked =
                currentSettings.gifs;

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =====================================================
   EDIT PROFILE
===================================================== */

function editUserProfile() {

    if (!currentUser) {
        return;
    }


    const name =
        prompt(

            "Enter your new username:",

            currentUser.username

        );


    if (
        !name ||
        !name.trim()
    ) {

        return;

    }


    currentUser.username =
        name.trim();


    saveUser();

    updateUserInterface();


    showToast(
        "✅",
        "Profile updated."
    );

}


/* =====================================================
   CLEAR DATA
===================================================== */

function clearOVCData() {

    if (
        !confirm(
            "Clear all OVC data?"
        )
    ) {

        return;

    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    localStorage.removeItem(
        SETTINGS_KEY
    );


    localStorage.removeItem(
        PEOPLE_STORAGE_KEY
    );


    location.reload();

}


/* =====================================================
   BOT
===================================================== */

const messages = [

    "Welcome to OVC! 👋",

    "Connect without depending on the Internet.",

    "Scan an OVC QR code to add someone.",

    "Your OVC identity is stored locally.",

    "Stay connected. Stay offline. 📡"

];


let messageIndex = 0;


function updateBotMessage() {

    if (botMessage) {

        botMessage.textContent =
            messages[
                messageIndex
            ];

    }


    if (homeBotMessage) {

        homeBotMessage.textContent =
            messages[
                messageIndex
            ];

    }


    messageIndex =

        (

            messageIndex + 1

        ) %

        messages.length;

}


setInterval(
    updateBotMessage,
    5000
);


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;


function showToast(
    icon,
    message
) {

    if (!toast) {
        return;
    }


    toastIcon.textContent =
        icon;


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },

            3500

        );

}


/* =====================================================
   VIBRATION
===================================================== */

function vibrate(
    pattern
) {

    if (
        !currentSettings.vibration
    ) {

        return;

    }


    if (
        navigator.vibrate
    ) {

        navigator.vibrate(
            pattern
        );

    }

}


/* =====================================================
   SERVICE WORKER
===================================================== */

function setupServiceWorker() {

    if (
        "serviceWorker" in
        navigator
    ) {

        window.addEventListener(
            "load",
            () => {

                navigator.serviceWorker
                    .register(
                        "sw.js"
                    )

                    .then(
                        registration => {

                            console.log(

                                "OVC Service Worker:",

                                registration.scope

                            );

                        }

                    )

                    .catch(
                        error => {

                            console.error(

                                "Service Worker error:",

                                error

                            );

                        }
                    );

            }
        );

    }

}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value
        );


    return div.innerHTML;

}


/* =====================================================
   DEBUG
===================================================== */

console.log(

    `OVC v${OVC_VERSION} loaded.`

);

