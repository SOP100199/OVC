/* =====================================================
   OVC - OFFLINE VIDEO COMMUNICATION
   CLIENT
   VERSION 1.0
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const OVC_VERSION = "1.0.0";

const STORAGE_KEY = "ovc-user";

const SETTINGS_KEY = "ovc-settings";

const PEOPLE_STORAGE_KEY = "ovc-people";

const SIGNALING_SERVER =
    "https://ovc-signaling.onrender.com";


/* =====================================================
   WEBRTC CONFIGURATION
===================================================== */

const rtcConfiguration = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        }

    ]

};


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


/* Navigation */

const navProfile =
    document.getElementById("nav-profile");

const navItems =
    document.querySelectorAll(".nav-item");

const bottomNavItems =
    document.querySelectorAll(".bottom-nav-item");

const sections =
    document.querySelectorAll(".page-section");


/* Profile */

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

const openScannerButton =
    document.getElementById("open-scanner");

const closeScannerButton =
    document.getElementById("close-scanner");

const cancelScannerButton =
    document.getElementById("cancel-scanner");

const qrScannerPanel =
    document.getElementById("qr-scanner-panel");

const qrReader =
    document.getElementById("qr-reader");

const scanResult =
    document.getElementById("scan-result");

const shareQr =
    document.getElementById("share-qr");

const downloadQr =
    document.getElementById("download-qr");


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


/* Connection */

const connectionModal =
    document.getElementById("connection-modal");

const connectionUserName =
    document.getElementById("connection-user-name");

const connectionUserAvatar =
    document.getElementById("connection-user-avatar");

const acceptConnection =
    document.getElementById("accept-connection");

const rejectConnection =
    document.getElementById("reject-connection");

const closeConnectionModal =
    document.getElementById("close-connection-modal");


/* Incoming Call */

const incomingCallModal =
    document.getElementById("incoming-call-modal");

const callerName =
    document.getElementById("caller-name");

const acceptCall =
    document.getElementById("accept-call");

const rejectCall =
    document.getElementById("reject-call");


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


/* Install */

const installPrompt =
    document.getElementById("install-prompt");

const installButton =
    document.getElementById("install-button");

const closeInstall =
    document.getElementById("close-install");


/* =====================================================
   APPLICATION STATE
===================================================== */

let currentUser = null;

let currentSettings = {

    vibration: true,

    notifications: true,

    gifs: true

};


let people = [];

let qrScanner = null;

let socket = null;

let localStream = null;

let remoteStream = null;

let peerConnection = null;

let currentConnectionUser = null;

let pendingCallUser = null;

let activeCallUser = null;

let isMuted = false;

let isCameraOff = false;

let callStartTime = null;

let callTimerInterval = null;

let deferredInstallPrompt = null;


/* =====================================================
   AVATARS
===================================================== */

const maleAvatars = [

    "🧑‍🎄",
    "🕵️‍♂️",
    "💂‍♂️",
    "🥷",
    "👨‍🎓",
    "🧑‍🚀",
    "🧙‍♂️"

];


const femaleAvatars = [

    "👩‍🎄",
    "🕵️‍♀️",
    "💂‍♀️",
    "🥷",
    "👩‍🎓",
    "🧑‍🚀",
    "🧙‍♀️"

];


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeOVC
);


function initializeOVC() {

    console.log(
        `OVC v${OVC_VERSION} initializing...`
    );

    loadSettings();

    loadPeople();

    loadStoredUser();

    setupNavigation();

    setupLogin();

    setupQRInterface();

    setupCallControls();

    setupConnectionControls();

    setupIncomingCallControls();

    setupSettings();

    setupInstallPrompt();

    setupSocket();

    setupServiceWorker();

    console.log(
        "OVC initialization complete."
    );

}


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


    currentUser = {

        id:
            generateUserId(),

        username,

        gender,

        avatar:
            generateAvatar(
                gender
            ),

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


    registerUserWithServer();


    showToast(
        "🎉",
        `Welcome ${username}!`
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
            .substring(
                2,
                10
            )

    );

}


function generateAvatar(
    gender
) {

    const avatars =
        gender === "female"
            ? femaleAvatars
            : maleAvatars;


    return avatars[
        Math.floor(
            Math.random() *
            avatars.length
        )
    ];

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

            currentUser =
                null;

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


        setTimeout(
            registerUserWithServer,
            500
        );

    }

    catch (error) {

        console.error(
            "OVC user loading error:",
            error
        );

        localStorage.removeItem(
            STORAGE_KEY
        );

        currentUser =
            null;

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


    /*
       IMPORTANT:

       Keep QR payload short.

       Do NOT put username,
       avatar and other data
       into QR.

       This prevents:
       code length overflow.
    */

    const qrText =
        `OVC:${currentUser.id}`;


    console.log(
        "Generating compact QR:",
        qrText
    );


    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.error(
            "QRCode library not loaded."
        );

        return;

    }


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


    if (openScannerButton) {

        openScannerButton.addEventListener(
            "click",
            openQRScanner
        );

    }


    if (closeScannerButton) {

        closeScannerButton.addEventListener(
            "click",
            closeQRScanner
        );

    }


    if (cancelScannerButton) {

        cancelScannerButton.addEventListener(
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
   OPEN QR SCANNER
===================================================== */

async function openQRScanner() {

    console.log(
        "📷 Start scanner clicked"
    );


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        console.error(
            "Html5Qrcode library unavailable."
        );

        showToast(
            "❌",
            "QR scanner library not loaded."
        );

        return;

    }


    if (!qrReader) {

        console.error(
            "#qr-reader not found."
        );

        return;

    }


    if (
        qrScanner
    ) {

        return;

    }


    qrScannerPanel.classList.remove(
        "hidden"
    );


    qrScannerPanel.style.display =
        "flex";


    scanResult.textContent =
        "Starting camera...";


    try {

        qrScanner =
            new Html5Qrcode(
                "qr-reader"
            );


        const cameras =
            await Html5Qrcode
                .getCameras();


        if (
            !cameras ||
            cameras.length === 0
        ) {

            throw new Error(
                "No camera found."
            );

        }


        let cameraId =
            cameras[0].id;


        const backCamera =
            cameras.find(
                camera =>
                    /back|rear|environment/i
                        .test(
                            camera.label
                        )
            );


        if (backCamera) {

            cameraId =
                backCamera.id;

        }


        await qrScanner.start(

            cameraId,

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

                // Normal:
                // QR not detected yet.

            }

        );


        scanResult.textContent =
            "Point your camera at an OVC QR code.";


        console.log(
            "✅ QR camera started."
        );

    }

    catch (error) {

        console.error(
            "❌ QR scanner error:",
            error
        );


        scanResult.textContent =
            "Unable to access camera.";


        showToast(
            "❌",
            "Could not open camera."
        );


        qrScanner =
            null;

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


    if (
        !decodedText.startsWith(
            "OVC:"
        )
    ) {

        showToast(
            "❌",
            "This is not an OVC QR code."
        );

        return;

    }


    const userId =
        decodedText.substring(
            4
        );


    if (!userId) {

        showToast(
            "❌",
            "Invalid OVC QR code."
        );

        return;

    }


    if (
        currentUser &&
        userId ===
        currentUser.id
    ) {

        showToast(
            "😅",
            "That's your own QR code."
        );

        return;

    }


    console.log(
        "🔍 Looking up OVC user:",
        userId
    );


    if (
        !socket ||
        !socket.connected
    ) {

        showToast(
            "❌",
            "Not connected to OVC server."
        );

        return;

    }


    scanResult.textContent =
        "Finding OVC user...";


    socket.emit(

        "find-user",

        userId,

        async user => {

            if (!user) {

                showToast(
                    "❌",
                    "User is currently offline."
                );

                return;

            }


            console.log(
                "✅ User found:",
                user
            );


            await closeQRScanner();


            currentConnectionUser = {

                id:
                    user.id,

                username:
                    user.username,

                avatar:
                    user.avatar || "👤"

            };


            showConnectionRequest(
                currentConnectionUser
            );


            socket.emit(
                "connection-request",
                {

                    to:
                        user.id,

                    from:
                        currentUser

                }
            );

        }

    );

}


/* =====================================================
   CLOSE QR SCANNER
===================================================== */

async function closeQRScanner() {

    if (qrScanner) {

        try {

            await qrScanner.stop();

            await qrScanner.clear();

        }

        catch (error) {

            console.warn(
                "QR scanner close:",
                error
            );

        }

        qrScanner =
            null;

    }


    if (qrScannerPanel) {

        qrScannerPanel.classList.add(
            "hidden"
        );

        qrScannerPanel.style.display =
            "none";

    }

}


/* =====================================================
   SHARE QR
===================================================== */

async function shareUserQR() {

    const canvas =
        qrCode
            ?.querySelector(
                "canvas"
            );


    if (!canvas) {

        showToast(
            "⚠️",
            "QR code is not ready."
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

                "OVC-QR.png",

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
                        "OVC QR",

                    text:
                        "Connect with me on OVC.",

                    files:
                        [file]

                }
            );

        }

        else {

            showToast(
                "ℹ️",
                "Sharing is not supported."
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
            ?.querySelector(
                "canvas"
            );


    if (!canvas) {

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "OVC-QR.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

}


/* =====================================================
   SOCKET.IO
===================================================== */

function setupSocket() {

    if (
        typeof io ===
        "undefined"
    ) {

        console.error(
            "Socket.IO client not loaded."
        );

        return;

    }


    socket =
        io(
            SIGNALING_SERVER,
            {

                transports:
                    [
                        "websocket",
                        "polling"
                    ],

                reconnection:
                    true

            }
        );


    socket.on(
        "connect",
        () => {

            console.log(
                "🟢 Connected to OVC signaling server:",
                socket.id
            );


            updateConnectionStatus(
                true
            );


            registerUserWithServer();

        }
    );


    socket.on(
        "disconnect",
        () => {

            console.log(
                "🔴 Disconnected from signaling server."
            );


            updateConnectionStatus(
                false
            );

        }
    );


    socket.on(
        "connect_error",
        error => {

            console.error(
                "❌ Socket connection error:",
                error
            );

        }
    );


    socket.on(
        "connection-request",
        data => {

            console.log(
                "📥 Connection request:",
                data
            );


            if (
                data &&
                data.from
            ) {

                currentConnectionUser =
                    data.from;


                showConnectionRequest(
                    data.from
                );

            }

        }
    );


    socket.on(
        "connection-response",
        data => {

            if (
                data.accepted
            ) {

                addPerson(
                    data.from
                );


                showToast(
                    "✅",
                    `${data.from.username} connected!`
                );

            }

            else {

                showToast(
                    "❌",
                    "Connection request rejected."
                );

            }

        }
    );


    socket.on(
        "user-offline",
        () => {

            showToast(
                "🔴",
                "User is offline."
            );

        }
    );


    setupWebRTCSignaling();

}


/* =====================================================
   REGISTER USER
===================================================== */

function registerUserWithServer() {

    if (
        !socket ||
        !socket.connected ||
        !currentUser
    ) {

        return;

    }


    socket.emit(
        "register-user",
        currentUser
    );


    console.log(
        "📡 Registered OVC user:",
        currentUser.username
    );

}


/* =====================================================
   CONNECTION REQUEST UI
===================================================== */

function showConnectionRequest(
    user
) {

    if (!connectionModal) {
        return;
    }


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


function setupConnectionControls() {

    if (acceptConnection) {

        acceptConnection.addEventListener(
            "click",
            acceptConnectionRequest
        );

    }


    if (rejectConnection) {

        rejectConnection.addEventListener(
            "click",
            rejectConnectionRequest
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

}


/* =====================================================
   ACCEPT CONNECTION
===================================================== */

function acceptConnectionRequest() {

    if (
        !currentConnectionUser
    ) {

        return;

    }


    connectionModal.classList.add(
        "hidden"
    );


    addPerson(
        currentConnectionUser
    );


    socket.emit(

        "connection-response",

        {

            to:
                currentConnectionUser.id,

            from:
                currentUser,

            accepted:
                true

        }

    );


    showToast(
        "✅",
        "Connection accepted."
    );

}


/* =====================================================
   REJECT CONNECTION
===================================================== */

function rejectConnectionRequest() {

    if (
        currentConnectionUser
    ) {

        socket.emit(

            "connection-response",

            {

                to:
                    currentConnectionUser.id,

                from:
                    currentUser,

                accepted:
                    false

            }

        );

    }


    connectionModal.classList.add(
        "hidden"
    );


    currentConnectionUser =
        null;

}


/* =====================================================
   PEOPLE
===================================================== */

function loadPeople() {

    try {

        const saved =
            localStorage.getItem(
                PEOPLE_STORAGE_KEY
            );


        if (saved) {

            people =
                JSON.parse(
                    saved
                );

        }

    }

    catch (error) {

        people = [];

    }


    renderPeople();

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

        return;

    }


    people.push(

        {

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

        }

    );


    savePeople();

    renderPeople();

}


function renderPeople() {

    if (!peopleList) {
        return;
    }


    peopleList
        .querySelectorAll(
            ".person-card"
        )
        .forEach(
            card =>
                card.remove()
        );


    if (
        people.length === 0
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

                    startCall(
                        person
                    );

                }
            );

        }
    );

}


/* =====================================================
   WEBRTC
===================================================== */

function setupWebRTCSignaling() {

    socket.on(
        "webrtc-offer",
        async data => {

            console.log(
                "📥 WebRTC offer received."
            );


            pendingCallUser =
                data.from;


            showIncomingCall(
                data.from
            );


            pendingOffer =
                data.offer;

        }
    );


    socket.on(
        "webrtc-answer",
        async data => {

            if (
                peerConnection
            ) {

                await peerConnection
                    .setRemoteDescription(
                        new RTCSessionDescription(
                            data.answer
                        )
                    );

            }

        }
    );


    socket.on(
        "ice-candidate",
        async data => {

            if (
                peerConnection &&
                data.candidate
            ) {

                try {

                    await peerConnection
                        .addIceCandidate(
                            new RTCIceCandidate(
                                data.candidate
                            )
                        );

                }

                catch (error) {

                    console.error(
                        "ICE error:",
                        error
                    );

                }

            }

        }
    );


    socket.on(
        "call-ended",
        () => {

            endCall(
                false
            );

        }
    );

}


let pendingOffer = null;


/* =====================================================
   START CALL
===================================================== */

async function startCall(
    user
) {

    try {

        activeCallUser =
            user;


        navigateTo(
            "video-section"
        );


        callStatus.textContent =
            "Opening camera...";


        await startLocalMedia();


        createPeerConnection(
            user
        );


        const offer =
            await peerConnection
                .createOffer();


        await peerConnection
            .setLocalDescription(
                offer
            );


        socket.emit(

            "webrtc-offer",

            {

                to:
                    user.id,

                from:
                    currentUser,

                offer

            }

        );


        callStatus.textContent =
            "Calling...";


    }

    catch (error) {

        console.error(
            "Start call error:",
            error
        );


        showToast(
            "❌",
            "Could not start video call."
        );

    }

}


/* =====================================================
   ACCEPT CALL
===================================================== */

async function acceptIncomingCall() {

    incomingCallModal.classList.add(
        "hidden"
    );


    if (
        !pendingCallUser ||
        !pendingOffer
    ) {

        return;

    }


    try {

        activeCallUser =
            pendingCallUser;


        navigateTo(
            "video-section"
        );


        await startLocalMedia();


        createPeerConnection(
            pendingCallUser
        );


        await peerConnection
            .setRemoteDescription(
                new RTCSessionDescription(
                    pendingOffer
                )
            );


        const answer =
            await peerConnection
                .createAnswer();


        await peerConnection
            .setLocalDescription(
                answer
            );


        socket.emit(

            "webrtc-answer",

            {

                to:
                    pendingCallUser.id,

                from:
                    currentUser,

                answer

            }

        );


        callStatus.textContent =
            "Connecting...";


        pendingOffer =
            null;

        pendingCallUser =
            null;

    }

    catch (error) {

        console.error(
            "Accept call error:",
            error
        );

    }

}


/* =====================================================
   CREATE PEER CONNECTION
===================================================== */

function createPeerConnection(
    user
) {

    if (peerConnection) {

        peerConnection.close();

    }


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


            remoteVideo
                .play()
                .catch(
                    () => {}
                );

        };


    peerConnection.onicecandidate =
        event => {

            if (
                event.candidate
            ) {

                socket.emit(

                    "ice-candidate",

                    {

                        to:
                            user.id,

                        from:
                            currentUser,

                        candidate:
                            event.candidate

                    }

                );

            }

        };


    peerConnection.onconnectionstatechange =
        () => {

            if (!peerConnection) {
                return;
            }


            const state =
                peerConnection
                    .connectionState;


            console.log(
                "WebRTC state:",
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
   LOCAL MEDIA
===================================================== */

async function startLocalMedia() {

    if (
        localStream
    ) {

        return;

    }


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


    localVideo.srcObject =
        localStream;


    localPlaceholder.classList.add(
        "hidden"
    );


    await localVideo
        .play()
        .catch(
            () => {}
        );

}


/* =====================================================
   INCOMING CALL
===================================================== */

function showIncomingCall(
    user
) {

    callerName.textContent =
        user.username;


    incomingCallModal.classList.remove(
        "hidden"
    );


    vibrate(
        [300, 150, 300]
    );

}


function setupIncomingCallControls() {

    acceptCall.addEventListener(
        "click",
        acceptIncomingCall
    );


    rejectCall.addEventListener(
        "click",
        () => {

            incomingCallModal.classList.add(
                "hidden"
            );


            pendingOffer =
                null;

            pendingCallUser =
                null;

        }
    );

}


/* =====================================================
   CALL CONTROLS
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
        () =>
            endCall(
                true
            )
    );


    fullscreenButton.addEventListener(
        "click",
        toggleFullscreen
    );

}


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


function endCall(
    notifyRemote = true
) {

    if (
        notifyRemote &&
        activeCallUser &&
        socket
    ) {

        socket.emit(

            "call-ended",

            {

                to:
                    activeCallUser.id,

                from:
                    currentUser

            }

        );

    }


    if (localStream) {

        localStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        localStream =
            null;

    }


    if (peerConnection) {

        peerConnection.close();

        peerConnection =
            null;

    }


    if (remoteVideo) {

        remoteVideo.srcObject =
            null;

    }


    activeCallUser =
        null;


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

                const elapsed =
                    Date.now() -
                    callStartTime;


                const seconds =
                    Math.floor(
                        elapsed /
                        1000
                    );


                const minutes =
                    Math.floor(
                        seconds /
                        60
                    );


                const remaining =
                    seconds %
                    60;


                callTimer.textContent =

                    String(
                        minutes
                    )
                    .padStart(
                        2,
                        "0"
                    )

                    +

                    ":"

                    +

                    String(
                        remaining
                    )
                    .padStart(
                        2,
                        "0"
                    );

            },

            1000

        );

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


    if (callTimer) {

        callTimer.textContent =
            "00:00";

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

        const saved =
            localStorage.getItem(
                SETTINGS_KEY
            );


        if (saved) {

            currentSettings = {

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
            error
        );

    }

}


/* =====================================================
   PROFILE
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

    registerUserWithServer();


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
   CONNECTION STATUS
===================================================== */

function updateConnectionStatus(
    connected
) {

    const element =
        document.getElementById(
            "connection-status"
        );


    if (!element) {
        return;
    }


    if (connected) {

        element.textContent =
            "🟢 OVC Server Connected";

    }

    else {

        element.textContent =
            "🔴 OVC Server Disconnected";

    }

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
                console.error
            );

    }

    else {

        document.exitFullscreen();

    }

}


/* =====================================================
   PWA INSTALL
===================================================== */

function setupInstallPrompt() {

    if (
        !installPrompt
    ) {

        return;

    }


    installPrompt.classList.add(
        "hidden"
    );


    if (installButton) {

        installButton.addEventListener(
            "click",
            installOVC
        );

    }


    if (closeInstall) {

        closeInstall.addEventListener(
            "click",
            () => {

                installPrompt.classList.add(
                    "hidden"
                );

            }
        );

    }


    window.addEventListener(
        "beforeinstallprompt",
        event => {

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
        () => {

            deferredInstallPrompt =
                null;


            installPrompt.classList.add(
                "hidden"
            );

        }
    );

}


async function installOVC() {

    if (
        !deferredInstallPrompt
    ) {

        return;

    }


    deferredInstallPrompt.prompt();


    await deferredInstallPrompt
        .userChoice;


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
        "serviceWorker" in
        navigator
    ) {

        window.addEventListener(
            "load",
            () => {

                navigator.serviceWorker
                    .register(
                        "./sw.js"
                    )
                    .then(
                        registration => {

                            console.log(
                                "Service Worker registered:",
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
        value;


    return div.innerHTML;

}


/* =====================================================
   DEBUG
===================================================== */

console.log(
    `OVC v${OVC_VERSION} client loaded.`
);