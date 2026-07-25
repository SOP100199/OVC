/* =====================================================
   OVC - OFFLINE VIDEO CALLING
   VERSION 1.0
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

/* Login */

const nameInput = document.getElementById("username");
const genderInput = document.getElementById("gender");
const send = document.getElementById("send");

const loginSection = document.getElementById("login-section");
const mainContent = document.getElementById("main-content");


/* Navbar */

const navProfile = document.getElementById("nav-profile");

const navItems = document.querySelectorAll(".nav-item");
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");

const sections = document.querySelectorAll(".page-section");


/* Profile */

const homeUsername = document.getElementById("home-username");
const profileUsername = document.getElementById("profile-username");
const qrUsername = document.getElementById("qr-username");

const homeAvatar = document.getElementById("home-avatar");
const profileAvatar = document.getElementById("profile-avatar");


/* GIF */

const loginGif = document.getElementById("login-gif");
const statusGif = document.getElementById("status-gif");
const callGif = document.getElementById("call-gif");

const botMessage = document.getElementById("bot-message");
const homeBotMessage = document.getElementById("home-bot-message");


/* QR */

const qrCode = document.getElementById("qr-code");

const myQrTab = document.getElementById("my-qr-tab");
const scanQrTab = document.getElementById("scan-qr-tab");

const myQrPanel = document.getElementById("my-qr-panel");
const scanQrPanel = document.getElementById("scan-qr-panel");

const startScan = document.getElementById("open-scanner");

const shareQr = document.getElementById("share-qr");
const downloadQr = document.getElementById("download-qr");


/* People */

const peopleList = document.getElementById("people-list");
const emptyPeople = document.getElementById("empty-people");
const connectionStatus = document.getElementById("connection-status");


/* Video */

const videoSection = document.getElementById("video-section");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");

const localPlaceholder = document.getElementById("local-placeholder");
const remotePlaceholder = document.getElementById("remote-placeholder");

const remoteUsername = document.getElementById("remote-username");

const callStatus = document.getElementById("call-status");
const callTimer = document.getElementById("call-timer");

const muteButton = document.getElementById("mute-button");
const cameraButton = document.getElementById("camera-button");
const endCallButton = document.getElementById("end-call-button");
const fullscreenButton = document.getElementById("fullscreen-button");


/* Incoming Call */

const incomingCallModal =
    document.getElementById("incoming-call-modal");

const callerName =
    document.getElementById("caller-name");

const acceptCall =
    document.getElementById("accept-call");

const rejectCall =
    document.getElementById("reject-call");


/* Connection Modal */

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

const settingsProfile =
    document.getElementById("settings-profile");

const editProfile =
    document.getElementById("edit-profile");


/* Install */

const installPrompt =
    document.getElementById("install-prompt");

const installButton =
    document.getElementById("install-button");

const closeInstall =
    document.getElementById("close-install");


/* Toast */

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toast-icon");

const toastMessage =
    document.getElementById("toast-message");



const openScanner =
    document.getElementById("open-scanner");

const qrScannerPanel =
    document.getElementById("qr-scanner-panel");

const closeScanner =
    document.getElementById("close-scanner");

const cancelScanner =
    document.getElementById("cancel-scanner");

const scanResult =
    document.getElementById("scan-result");

let qrScanner = null;
/* =====================================================
   CONFIGURATION
===================================================== */

const OVC_VERSION = "1.0.0";

const STORAGE_KEY = "ovc-user";

const SETTINGS_KEY = "ovc-settings";

const PEERS_KEY = "ovc-peers";


/* =====================================================
   GIFS
===================================================== */

const gifs = {

    welcome:
        "assets/gifs/welcome.gif",

    calling:
        "assets/gifs/calling.gif",

    celebrating:
        "assets/gifs/celebrating.gif",

    confused:
        "assets/gifs/confused.gif",

    connectionlost:
        "assets/gifs/connectionlost.gif",

    dancing:
        "assets/gifs/dancing.gif",

    excited:
        "assets/gifs/excited.gif",

    goodbye:
        "assets/gifs/goodbye.gif",

    laughing:
        "assets/gifs/laughing.gif",

    shocked:
        "assets/gifs/shocked.gif",

    success:
        "assets/gifs/success.gif",

    talking:
        "assets/gifs/talking.gif",

    thinking:
        "assets/gifs/thinking.gif"

};


/* =====================================================
   BOT MESSAGES
===================================================== */

const messages = [

    "Hey! 👋",

    "Welcome to OVC! 😎",

    "I'm your OVC guide 🤖",

    "No boring login forms here 😂",

    "Just enter your name! 👇",

    "Let's get you connected! 📡"

];

let messageIndex = 0;


/* =====================================================
   USER AVATARS
===================================================== */

const userProfileBoyImages = [

    "🧑‍🎄",
    "🕵️‍♂️",
    "💂‍♂️",
    "🥷",
    "👨‍🎓",
    "🧑‍🚀",
    "🧙‍♂️"

];


const userProfileGirlImages = [

    "👩‍🎄",
    "🕵️‍♀️",
    "💂‍♀️",
    "🥷",
    "👩‍🎓",
    "🧑‍🚀",
    "🧙‍♀️"

];


/* =====================================================
   APPLICATION STATE
===================================================== */

let currentUser = null;

let currentSettings = {

    vibration: true,

    notifications: true,

    gifs: true

};


let localStream = null;

let remoteStream = null;

let peerConnection = null;

let callStartTime = null;

let callTimerInterval = null;

let isMuted = false;

let isCameraOff = false;

let deferredInstallPrompt = null;

let currentConnectionUser = null;


/* =====================================================
   WEBRTC CONFIGURATION
===================================================== */

/*
    IMPORTANT:

    This is only the WebRTC configuration.

    WebRTC still needs signaling.

    The signaling mechanism must exchange:

    1. SDP Offer
    2. SDP Answer
    3. ICE Candidates

    We will add the signaling mechanism separately.
*/

const rtcConfiguration = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        }

    ]

};


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeOVC
);


function initializeOVC() {

    loadSettings();

    loadStoredUser();

    setupNavigation();

    setupLogin();

    setupQRInterface();

    setupCallControls();

    setupSettings();

    setupInstallPrompt();

    setupServiceWorker();

    setupPWAEvents();

    updateBotMessage();

}


/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {

    if (!send) {
        return;
    }


    send.addEventListener(
        "click",
        loginUser
    );


    if (nameInput) {

        nameInput.addEventListener(
            "keydown",
            function (event) {

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

    const username =
        nameInput.value.trim();


    if (!username) {

        showToast(
            "⚠️",
            "Please enter your name."
        );

        vibrate(
            [100, 50, 100]
        );

        nameInput.focus();

        return;

    }


    const gender =
        genderInput.value;


    const avatar =
        generateAvatar(gender);


    currentUser = {

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


    loginSection.classList.add(
        "hidden"
    );


    mainContent.classList.remove(
        "hidden"
    );


    setStatus(
        "success"
    );


    showToast(
        "🎉",
        `Welcome ${username}!`
    );


    vibrate(
        [100, 50, 100]
    );


    navigateTo(
        "home-section"
    );

}


function generateUserId() {

    return (
        "ovc-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


function generateAvatar(gender) {

    const avatars =
        gender === "female"
            ? userProfileGirlImages
            : userProfileBoyImages;


    const index =
        Math.floor(
            Math.random() *
            avatars.length
        );


    return avatars[index];

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
            !currentUser.username
        ) {

            currentUser = null;

            return;

        }


        updateUserInterface();


        loginSection.classList.add(
            "hidden"
        );


        mainContent.classList.remove(
            "hidden"
        );

    }

    catch (error) {

        console.error(
            "OVC: Failed to load user",
            error
        );

        localStorage.removeItem(
            STORAGE_KEY
        );

    }

}


/* =====================================================
   UPDATE USER UI
===================================================== */

function updateUserInterface() {

    if (!currentUser) {
        return;
    }


    const username =
        currentUser.username;


    const avatar =
        currentUser.avatar;


    if (homeUsername) {

        homeUsername.textContent =
            username;

    }


    if (profileUsername) {

        profileUsername.textContent =
            username;

    }


    if (qrUsername) {

        qrUsername.textContent =
            username;

    }


    if (homeAvatar) {

        homeAvatar.textContent =
            avatar;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            avatar;

    }


    generateUserQR();

}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    const section =
                        this.dataset.section;

                    navigateTo(
                        section
                    );

                }
            );

        }
    );


    bottomNavItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    const section =
                        this.dataset.section;

                    navigateTo(
                        section
                    );

                }
            );

        }
    );


    navProfile.addEventListener(
        "click",
        function () {

            navigateTo(
                "profile-section"
            );

        }
    );


    document
        .querySelectorAll(
            "[data-section]"
        )
        .forEach(
            button => {

                if (
                    button.classList.contains(
                        "nav-item"
                    ) ||
                    button.classList.contains(
                        "bottom-nav-item"
                    )
                ) {

                    return;

                }


                button.addEventListener(
                    "click",
                    function () {

                        navigateTo(
                            this.dataset.section
                        );

                    }
                );

            }
        );

}


function navigateTo(sectionId) {

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


    navItems.forEach(
        item => {

            item.classList.toggle(

                "active",

                item.dataset.section ===
                sectionId

            );

        }
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
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =====================================================
   QR INTERFACE
===================================================== */

function setupQRInterface() {

    if (myQrTab) {

        myQrTab.addEventListener(
            "click",
            function () {

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
            function () {

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
   QR GENERATION
===================================================== */

function generateUserQR() {

    if (!qrCode || !currentUser) {
        console.log("QR Code element or user not available");
        return;
    }

    // Clear old QR code
    qrCode.innerHTML = "";

    // Data stored inside the QR code
    const qrData = {
        type: "OVC_USER",
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar
    };

    // Convert object to string
    const qrText = JSON.stringify(qrData);

    console.log("Generating QR:", qrText);

    // Check if QR library loaded
    if (typeof QRCode === "undefined") {

        console.error(
            "QRCode library not found!"
        );

        qrCode.innerHTML = `
            <div class="qr-error">
                ⚠️ QR generator unavailable
            </div>
        `;

        return;
    }

    // Generate actual QR code
    new QRCode(qrCode, {

        text: qrText,

        width: 220,

        height: 220,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.H

    });

}

async function shareUserQR() {

    if (!currentUser) {
        showToast("⚠️", "Please log in first.");
        return;
    }

    const qrElement =
        document.getElementById("qr-code");

    const canvas =
        qrElement?.querySelector("canvas");

    if (!canvas) {
        showToast(
            "⚠️",
            "QR code is not ready yet."
        );
        return;
    }

    try {

        // Convert QR canvas to image
        const blob =
            await new Promise(resolve => {

                canvas.toBlob(
                    resolve,
                    "image/png"
                );

            });


        // Create a shareable file
        const file =
            new File(
                [blob],
                `${currentUser.username}-OVC-QR.png`,
                {
                    type: "image/png"
                }
            );


        // Modern mobile browsers
        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [file]
            })
        ) {

            await navigator.share({

                title:
                    "Connect with me on OVC",

                text:
                    `Scan my OVC QR code to connect with ${currentUser.username}.`,

                files: [file]

            });

            showToast(
                "📤",
                "QR code shared!"
            );

        }

        // Fallback for browsers without file sharing
        else if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    "Connect with me on OVC",

                text:
                    `Connect with ${currentUser.username} on OVC.`

            });

        }

        else {

            showToast(
                "ℹ️",
                "Sharing is not supported on this browser."
            );

        }

    }

    catch (error) {

        if (
            error.name !==
            "AbortError"
        ) {

            console.error(
                "OVC QR sharing error:",
                error
            );

            showToast(
                "❌",
                "Unable to share QR code."
            );

        }

    }

}


function downloadUserQR() {

    const qrElement =
        document.getElementById("qr-code");

    if (!qrElement) {
        return;
    }

    const canvas =
        qrElement.querySelector("canvas");

    if (!canvas) {

        showToast(
            "⚠️",
            "QR code is not ready."
        );

        return;

    }

    const link =
        document.createElement("a");

    link.download =
        `${currentUser.username}-OVC-QR.png`;

    link.href =
        canvas.toDataURL("image/png");

    link.click();

    showToast(
        "💾",
        "QR code saved!"
    );

}
/* =====================================================
   QR SCANNER
===================================================== */

async function startQRScanner() {

    showToast(
        "📷",
        "Starting QR scanner..."
    );


    /*
        The scanner requires a QR decoding library.

        Recommended approach:

        Camera
            ↓
        QR Decoder
            ↓
        OVC User Data
            ↓
        Connection Request

        We will integrate the QR decoder
        in the next stage.
    */


    vibrate(
        [100]
    );

}


/* =====================================================
   PEOPLE
===================================================== */

function addPersonToList(user) {

    if (!peopleList) {
        return;
    }


    if (emptyPeople) {

        emptyPeople.remove();

    }


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "person-card";


    card.innerHTML = `

        <div class="person-avatar">
            ${user.avatar || "👤"}
        </div>

        <div class="person-info">

            <h3>
                ${escapeHTML(
                    user.username
                )}
            </h3>

            <span>
                🟢 Available
            </span>

        </div>

        <button
            class="call-person-button"
            data-user-id="${user.id}"
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
        function () {

            requestCall(
                user
            );

        }
    );

}


/* =====================================================
   CONNECTION REQUEST
===================================================== */

function requestCall(user) {

    currentConnectionUser =
        user;


    connectionUserName.textContent =
        user.username;


    connectionUserAvatar.textContent =
        user.avatar || "👤";


    connectionModal.classList.remove(
        "hidden"
    );


    vibrate(
        [100, 50, 100]
    );

}


closeConnectionModal.addEventListener(
    "click",
    function () {

        connectionModal.classList.add(
            "hidden"
        );

    }
);


rejectConnection.addEventListener(
    "click",
    function () {

        connectionModal.classList.add(
            "hidden"
        );

        currentConnectionUser =
            null;

    }
);


acceptConnection.addEventListener(
    "click",
    async function () {

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


/* =====================================================
   VIDEO CALL
===================================================== */

function setupCallControls() {

    muteButton.addEventListener(
        "click",
        toggleMute
    );


    cameraButton.addEventListener(
        "click",
        toggleCamera
    );


    endCallButton.addEventListener(
        "click",
        endCall
    );


    fullscreenButton.addEventListener(
        "click",
        toggleFullscreen
    );

}


async function startCall(user) {

    try {

        navigateTo(
            "video-section"
        );


        callStatus.textContent =
            "Requesting camera and microphone...";


        callGif.src =
            gifs.calling;


        await startLocalMedia();


        createPeerConnection();


        remoteUsername.textContent =
            user.username;


        callStatus.textContent =
            "Connecting...";


        /*
            WebRTC signaling must happen here.

            Example:

            1. createOffer()
            2. send offer to remote peer
            3. receive answer
            4. exchange ICE candidates
        */


        showToast(
            "📡",
            "Waiting for connection..."
        );

    }

    catch (error) {

        console.error(
            "OVC call error:",
            error
        );


        showToast(
            "❌",
            "Unable to start camera or microphone."
        );

    }

}


/* =====================================================
   LOCAL MEDIA
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
                    video: true,
                    audio: true
                }
            );


    localVideo.srcObject =
        localStream;


    localPlaceholder.classList.add(
        "hidden"
    );

}


/* =====================================================
   WEBRTC PEER CONNECTION
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


    if (localStream) {

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

    }


    peerConnection.ontrack =
        function (event) {

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
        function () {

            const state =
                peerConnection
                    .connectionState;


            console.log(
                "OVC WebRTC state:",
                state
            );


            if (
                state ===
                "connected"
            ) {

                callStatus.textContent =
                    "Connected 🟢";


                callGif.src =
                    gifs.success;


                startCallTimer();


                vibrate(
                    [100]
                );

            }


            if (
                state ===
                "disconnected" ||
                state ===
                "failed"
            ) {

                callStatus.textContent =
                    "Connection lost";


                callGif.src =
                    gifs.connectionlost;

            }

        };


    /*
        ICE candidates must be
        sent through signaling.
    */

    peerConnection.onicecandidate =
        function (event) {

            if (
                event.candidate
            ) {

                console.log(
                    "ICE candidate generated:",
                    event.candidate
                );

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


    const audioTracks =
        localStream.getAudioTracks();


    audioTracks.forEach(
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


    muteButton.classList.toggle(
        "active",
        isMuted
    );


    vibrate(
        [50]
    );

}


/* =====================================================
   CAMERA
===================================================== */

function toggleCamera() {

    if (!localStream) {
        return;
    }


    const videoTracks =
        localStream.getVideoTracks();


    videoTracks.forEach(
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


    cameraButton.classList.toggle(
        "active",
        isCameraOff
    );


    localPlaceholder.classList.toggle(
        "hidden",
        !isCameraOff
    );


    vibrate(
        [50]
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
                track => {

                    track.stop();

                }
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


    callStatus.textContent =
        "Call ended";


    callGif.src =
        gifs.goodbye;


    showToast(
        "👋",
        "Call ended."
    );


    vibrate(
        [100, 50, 100]
    );


    setTimeout(
        function () {

            navigateTo(
                "home-section"
            );

        },
        1200
    );

}


/* =====================================================
   CALL TIMER
===================================================== */

function startCallTimer() {

    callStartTime =
        Date.now();


    stopCallTimer();


    callTimerInterval =
        setInterval(
            updateCallTimer,
            1000
        );

}


function updateCallTimer() {

    if (!callStartTime) {
        return;
    }


    const elapsed =
        Date.now() -
        callStartTime;


    const seconds =
        Math.floor(
            elapsed / 1000
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    callTimer.textContent =

        String(minutes)
            .padStart(2, "0")

        +

        ":"

        +

        String(
            remainingSeconds
        )
            .padStart(2, "0");

}


function stopCallTimer() {

    if (
        callTimerInterval
    ) {

        clearInterval(
            callTimerInterval
        );

        callTimerInterval =
            null;

    }


    callStartTime =
        null;


    callTimer.textContent =
        "00:00";

}


/* =====================================================
   FULLSCREEN
===================================================== */

function toggleFullscreen() {

    if (
        !videoSection
    ) {
        return;
    }


    if (
        !document.fullscreenElement
    ) {

        videoSection
            .requestFullscreen()
            .catch(
                error => {

                    console.error(
                        error
                    );

                }
            );

    }

    else {

        document.exitFullscreen();

    }

}


/* =====================================================
   SETTINGS
===================================================== */

function setupSettings() {

    vibrationToggle.addEventListener(
        "change",
        function () {

            currentSettings.vibration =
                this.checked;

            saveSettings();

        }
    );


    notificationToggle.addEventListener(
        "change",
        function () {

            currentSettings.notifications =
                this.checked;

            saveSettings();

        }
    );


    gifToggle.addEventListener(
        "change",
        function () {

            currentSettings.gifs =
                this.checked;

            saveSettings();

        }
    );


    clearData.addEventListener(
        "click",
        clearOVCData
    );


    editProfile.addEventListener(
        "click",
        editUserProfile
    );


    settingsProfile.addEventListener(
        "click",
        function () {

            navigateTo(
                "profile-section"
            );

        }
    );

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

        const saved =
            localStorage.getItem(
                SETTINGS_KEY
            );


        if (saved) {

            currentSettings =
                {
                    ...currentSettings,

                    ...JSON.parse(
                        saved
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
            "OVC settings error:",
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


    const newName =
        prompt(
            "Enter your new username:",
            currentUser.username
        );


    if (
        !newName ||
        !newName.trim()
    ) {

        return;

    }


    currentUser.username =
        newName.trim();


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

    const confirmed =
        confirm(
            "Clear all OVC local data?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    localStorage.removeItem(
        SETTINGS_KEY
    );


    localStorage.removeItem(
        PEERS_KEY
    );


    currentUser =
        null;


    location.reload();

}


/* =====================================================
   VIBRATION
===================================================== */

function vibrate(pattern) {

    if (
        !currentSettings.vibration
    ) {

        return;

    }


    if (
        "vibrate" in navigator
    ) {

        try {

            navigator.vibrate(
                pattern
            );

        }

        catch (error) {

            console.log(
                "Vibration unavailable."
            );

        }

    }

}


/* =====================================================
   GIF STATUS
===================================================== */

function setStatus(status) {

    if (
        !currentSettings.gifs
    ) {

        return;

    }


    const gifMap = {

        success:
            gifs.success,

        calling:
            gifs.calling,

        connectionlost:
            gifs.connectionlost,

        goodbye:
            gifs.goodbye,

        thinking:
            gifs.thinking,

        excited:
            gifs.excited,

        dancing:
            gifs.dancing

    };


    if (
        statusGif &&
        gifMap[status]
    ) {

        statusGif.src =
            gifMap[status];

    }

}


/* =====================================================
   BOT MESSAGES
===================================================== */

function updateBotMessage() {

    if (!botMessage) {
        return;
    }


    botMessage.textContent =
        messages[messageIndex];


    messageIndex =

        (
            messageIndex + 1
        )
        %
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
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =====================================================
   INSTALL PROMPT
===================================================== */

function setupInstallPrompt() {

    if (!installPrompt) {
        return;
    }


    installPrompt.classList.add(
        "hidden"
    );


    installButton.addEventListener(
        "click",
        installOVC
    );


    closeInstall.addEventListener(
        "click",
        function () {

            installPrompt.classList.add(
                "hidden"
            );

        }
    );

}


function setupPWAEvents() {

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            event.preventDefault();


            deferredInstallPrompt =
                event;


            installPrompt.classList.remove(
                "hidden"
            );

        }
    );


    window.addEventListener(
        "appinstalled",
        function () {

            deferredInstallPrompt =
                null;


            installPrompt.classList.add(
                "hidden"
            );


            showToast(
                "🎉",
                "OVC installed successfully!"
            );

        }
    );

}


async function installOVC() {

    if (
        !deferredInstallPrompt
    ) {

        showToast(
            "ℹ️",
            "OVC installation is not available right now."
        );

        return;

    }


    deferredInstallPrompt.prompt();


    const result =
        await deferredInstallPrompt
            .userChoice;


    console.log(
        "OVC install result:",
        result.outcome
    );


    deferredInstallPrompt =
        null;


    installPrompt.classList.add(
        "hidden"
    );

}


/* =====================================================
   SERVICE WORKER
===================================================== */

function setupServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .then(
                    registration => {

                        console.log(
                            "OVC Service Worker registered:",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "OVC Service Worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}


/* =====================================================
   INCOMING CALL
===================================================== */

function showIncomingCall(user) {

    callerName.textContent =
        user.username;


    incomingCallModal.classList.remove(
        "hidden"
    );


    callGif.src =
        gifs.calling;


    vibrate(
        [
            300,
            150,
            300,
            150,
            300
        ]
    );

}


acceptCall.addEventListener(
    "click",
    async function () {

        incomingCallModal.classList.add(
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


rejectCall.addEventListener(
    "click",
    function () {

        incomingCallModal.classList.add(
            "hidden"
        );


        vibrate(
            [100]
        );

    }
);


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =====================================================
   PAGE VISIBILITY
===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.hidden
        ) {

            console.log(
                "OVC moved to background."
            );

        }

        else {

            console.log(
                "OVC returned to foreground."
            );

        }

    }
);


/* =====================================================
   BEFORE UNLOAD
===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        if (localStream) {

            localStream
                .getTracks()
                .forEach(
                    track => {

                        track.stop();

                    }
                );

        }

    }
);

/* =====================================================
   OVC PEOPLE / CONTACT SYSTEM
===================================================== */

const PEOPLE_STORAGE_KEY =
    "ovc-people";


let people = [];


/* =====================================================
   LOAD PEOPLE
===================================================== */

function loadPeople() {

    try {

        const savedPeople =
            localStorage.getItem(
                PEOPLE_STORAGE_KEY
            );


        if (savedPeople) {

            people =
                JSON.parse(
                    savedPeople
                );

        }


        renderPeople();

    }

    catch (error) {

        console.error(
            "Failed to load OVC people:",
            error
        );

        people = [];

    }

}


/* =====================================================
   SAVE PEOPLE
===================================================== */

function savePeople() {

    localStorage.setItem(

        PEOPLE_STORAGE_KEY,

        JSON.stringify(
            people
        )

    );

}


/* =====================================================
   ADD PERSON
===================================================== */

function addPerson(user) {

    if (!user || !user.id) {

        showToast(
            "⚠️",
            "Invalid OVC user."
        );

        return;

    }


    // Don't add yourself
    if (
        currentUser &&
        user.id === currentUser.id
    ) {

        showToast(
            "😅",
            "That's you!"
        );

        return;

    }


    // Check duplicate
    const alreadyExists =
        people.some(
            person =>
                person.id === user.id
        );


    if (alreadyExists) {

        showToast(
            "👋",
            `${user.username} is already connected.`
        );

        return;

    }


    const newPerson = {

        id:
            user.id,

        username:
            user.username,

        avatar:
            user.avatar || "👤",

        status:
            "available",

        addedAt:
            Date.now()

    };


    people.push(
        newPerson
    );


    savePeople();

    renderPeople();


    showToast(
        "✅",
        `${user.username} added to People!`
    );


    vibrate(
        [100, 50, 100]
    );

}


/* =====================================================
   RENDER PEOPLE
===================================================== */

function renderPeople() {

    if (!peopleList) {
        return;
    }


    // Remove existing cards
    peopleList
        .querySelectorAll(
            ".person-card"
        )
        .forEach(
            card => card.remove()
        );


    // Empty state
    if (
        people.length === 0
    ) {

        if (emptyPeople) {

            emptyPeople.style.display =
                "flex";

        }

        return;

    }


    // Hide empty state
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

                    <span class="person-status">
                        🟢 Available
                    </span>

                </div>

                <button
                    class="call-person-button"
                    data-user-id="${person.id}"
                    aria-label="Call ${escapeHTML(
                        person.username
                    )}"
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
                function () {

                    const selectedUser =
                        people.find(
                            p =>
                                p.id ===
                                person.id
                        );


                    if (
                        selectedUser
                    ) {

                        requestCall(
                            selectedUser
                        );

                    }

                }
            );

        }
    );

}


/* =====================================================
   REMOVE PERSON
===================================================== */

function removePerson(
    userId
) {

    people =
        people.filter(
            person =>
                person.id !== userId
        );


    savePeople();

    renderPeople();


    showToast(
        "🗑️",
        "Connection removed."
    );

}


/* =====================================================
   INITIALIZE PEOPLE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPeople();

    }
);
function openQRScanner() {

    console.log("📷 Scan QR button clicked");

    if (typeof Html5Qrcode === "undefined") {

        console.error(
            "❌ Html5Qrcode library is not loaded"
        );

        showToast(
            "⚠️",
            "QR scanner library not loaded."
        );

        return;
    }

    const scannerElement =
        document.getElementById("qr-reader");

    if (!scannerElement) {

        console.error(
            "❌ #qr-reader element not found"
        );

        return;
    }

    // Show scanner panel
    qrScannerPanel.style.display = "block";

    console.log(
        "📷 Starting camera..."
    );

    qrScanner =
        new Html5Qrcode(
            "qr-reader"
        );

    qrScanner.start(

        {
            facingMode: {
                exact: "environment"
            }
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }

        },

        function(decodedText) {

            console.log(
                "✅ QR detected:",
                decodedText
            );

            handleQRScan(
                decodedText
            );

        },

        function(errorMessage) {

            // QR not detected yet.
            // This is normal and can be ignored.

        }

    )
    .then(function() {

        console.log(
            "✅ Camera started successfully"
        );

    })
    .catch(function(error) {

        console.error(
            "❌ Camera failed:",
            error
        );

        showToast(
            "❌",
            "Could not open camera."
        );

    });

}
function handleQRScan(decodedText) {

    console.log(
        "📷 Raw QR data:",
        decodedText
    );

    let userData;

    // Try to decode JSON
    try {

        userData =
            JSON.parse(
                decodedText
            );

    }

    catch (error) {

        console.error(
            "❌ QR is not valid JSON:",
            error
        );

        const result =
            document.getElementById(
                "scan-result"
            );

        if (result) {

            result.innerHTML = `
                <p>
                    ❌ Invalid QR code
                </p>

                <small>
                    This QR code is not an OVC profile.
                </small>
            `;

        }

        return;

    }


    console.log(
        "📦 Decoded OVC data:",
        userData
    );


    // Check QR type
    if (
        userData.type !==
        "OVC_USER"
    ) {

        console.error(
            "❌ Not an OVC user QR"
        );

        showToast(
            "❌",
            "This is not an OVC QR code."
        );

        return;

    }


    // Check required fields
    if (
        !userData.id ||
        !userData.username
    ) {

        console.error(
            "❌ Invalid OVC user data"
        );

        showToast(
            "❌",
            "Invalid OVC profile."
        );

        return;

    }


    // Prevent scanning yourself
    if (
        currentUser &&
        userData.id ===
        currentUser.id
    ) {

        showToast(
            "😅",
            "That's your own QR code!"
        );

        return;

    }


    console.log(
        "✅ Valid OVC user:",
        userData.username
    );


    // Stop scanner
    closeQRScanner();


    // Add user
    addPerson(
        userData
    );

}

function stopQRScanner() {

    if (!qrScanner) {
        return;
    }

    qrScanner.stop()
        .then(
            function () {

                qrScanner.clear();

                qrScanner = null;

            }
        )
        .catch(
            function (error) {

                console.error(
                    "Failed to stop QR scanner:",
                    error
                );

            }
        );

}
function closeQRScanner() {

    stopQRScanner();

    qrScannerPanel.style.display =
        "none";

}
if (openScanner) {

    openScanner.addEventListener(
        "click",
        openQRScanner
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


/* =====================================================
   DEBUG
===================================================== */

console.log(
    `OVC v${OVC_VERSION} initialized.`
);