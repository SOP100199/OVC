/* =====================================================
   OVC OFFLINE
   SERVERLESS LAN VIDEO COMMUNICATION
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const STORAGE_KEY =
    "ovc-offline-user";

const PEOPLE_KEY =
    "ovc-offline-people";

const SETTINGS_KEY =
    "ovc-offline-settings";


/* =====================================================
   DOM
===================================================== */

const $ = id =>
    document.getElementById(id);


/* Login */

const loginSection =
    $("login-section");

const mainContent =
    $("main-content");

const nameInput =
    $("username");

const genderInput =
    $("gender");

const sendButton =
    $("send");


/* Profile */

const homeUsername =
    $("home-username");

const profileUsername =
    $("profile-username");

const qrUsername =
    $("qr-username");

const homeAvatar =
    $("home-avatar");

const profileAvatar =
    $("profile-avatar");


/* Navigation */

const sections =
    document.querySelectorAll(
        ".page-section"
    );

const navItems =
    document.querySelectorAll(
        ".bottom-nav-item"
    );

const navProfile =
    $("nav-profile");


/* QR */

const qrCode =
    $("qr-code");

const myQrTab =
    $("my-qr-tab");

const scanQrTab =
    $("scan-qr-tab");

const myQrPanel =
    $("my-qr-panel");

const scanQrPanel =
    $("scan-qr-panel");

const openScannerButton =
    $("open-scanner");

const qrScannerPanel =
    $("qr-scanner-panel");

const closeScannerButton =
    $("close-scanner");

const cancelScannerButton =
    $("cancel-scanner");

const qrReader =
    $("qr-reader");


/* People */

const peopleList =
    $("people-list");

const emptyPeople =
    $("empty-people");


/* Video */

const videoSection =
    $("video-section");

const localVideo =
    $("local-video");

const remoteVideo =
    $("remote-video");

const localPlaceholder =
    $("local-placeholder");

const remotePlaceholder =
    $("remote-placeholder");

const remoteUsername =
    $("remote-username");

const callStatus =
    $("call-status");

const callTimer =
    $("call-timer");

const muteButton =
    $("mute-button");

const cameraButton =
    $("camera-button");

const endCallButton =
    $("end-call-button");

const fullscreenButton =
    $("fullscreen-button");


/* Signal */

const signalModal =
    $("signal-modal");

const signalTitle =
    $("signal-title");

const signalDescription =
    $("signal-description");

const signalQr =
    $("signal-qr");

const signalInput =
    $("signal-input");

const signalScanButton =
    $("signal-scan-button");

const signalSubmitButton =
    $("signal-submit-button");

const signalCloseButton =
    $("signal-close-button");


/* Toast */

const toast =
    $("toast");

const toastIcon =
    $("toast-icon");

const toastMessage =
    $("toast-message");


/* =====================================================
   STATE
===================================================== */

let currentUser =
    null;

let people =
    [];

let localStream =
    null;

let remoteStream =
    null;

let peerConnection =
    null;

let currentRemoteUser =
    null;

let qrScanner =
    null;

let signalScanner =
    null;

let signalMode =
    null;

let callTimerInterval =
    null;

let callStartTime =
    null;

let isMuted =
    false;

let isCameraOff =
    false;


/* =====================================================
   WEBRTC
===================================================== */

/*
   IMPORTANT:

   No STUN server.

   This means:

   WebRTC is intended for
   same-LAN communication.

   No Internet is required.
*/

const rtcConfiguration = {

    iceServers: []

};


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    loadUser();

    loadPeople();

    setupLogin();

    setupNavigation();

    setupQR();

    setupPeople();

    setupCallControls();

    setupSignalControls();

    setupProfile();

    registerServiceWorker();

}


/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {

    if (!sendButton) {
        return;
    }

    sendButton.addEventListener(
        "click",
        login
    );

}


function login() {

    const username =
        nameInput.value.trim();

    if (!username) {

        showToast(
            "⚠️",
            "Enter your name."
        );

        return;

    }

    currentUser = {

        id:
            "ovc-" +
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 8),

        username,

        gender:
            genderInput.value,

        avatar:
            genderInput.value === "female"
                ? "👩‍🎓"
                : "👨‍🎓",

        createdAt:
            Date.now()

    };


    saveUser();

    showApplication();

}


/* =====================================================
   USER STORAGE
===================================================== */

function saveUser() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            currentUser
        )

    );

}


function loadUser() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!data) {
            return;
        }

        currentUser =
            JSON.parse(
                data
            );

        if (
            !currentUser ||
            !currentUser.username
        ) {

            currentUser =
                null;

            return;

        }

        showApplication();

    }

    catch (error) {

        console.error(
            error
        );

        localStorage.removeItem(
            STORAGE_KEY
        );

    }

}


function showApplication() {

    loginSection.classList.add(
        "hidden"
    );

    mainContent.classList.remove(
        "hidden"
    );

    updateUserUI();

    generateUserQR();

}


/* =====================================================
   USER UI
===================================================== */

function updateUserUI() {

    if (!currentUser) {
        return;
    }

    homeUsername.textContent =
        currentUser.username;

    profileUsername.textContent =
        currentUser.username;

    qrUsername.textContent =
        currentUser.username;

    homeAvatar.textContent =
        currentUser.avatar;

    profileAvatar.textContent =
        currentUser.avatar;

}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    navItems.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    navigateTo(
                        button.dataset.section
                    );

                }
            );

        }
    );


    navProfile.addEventListener(
        "click",
        () => {

            navigateTo(
                "profile-section"
            );

        }
    );

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


    const section =
        $(sectionId);

    if (!section) {
        return;
    }


    section.classList.add(
        "active-section"
    );


    navItems.forEach(
        button => {

            button.classList.toggle(

                "active",

                button.dataset.section ===
                sectionId

            );

        }
    );

}


/* =====================================================
   QR IDENTITY
===================================================== */

function generateUserQR() {

    if (
        !currentUser ||
        !qrCode ||
        typeof QRCode ===
        "undefined"
    ) {

        return;

    }


    qrCode.innerHTML =
        "";


    const data = {

        type:
            "OVC_USER",

        id:
            currentUser.id,

        username:
            currentUser.username,

        avatar:
            currentUser.avatar

    };


    /*
       Keep QR data small.

       This avoids:

       "code length overflow"
    */

    const text =
        JSON.stringify(
            data
        );


    new QRCode(

        qrCode,

        {

            text,

            width:
                200,

            height:
                200,

            correctLevel:
                QRCode.CorrectLevel.L

        }

    );

}


/* =====================================================
   QR TABS
===================================================== */

function setupQR() {

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


    openScannerButton.addEventListener(
        "click",
        startIdentityScanner
    );


    closeScannerButton.addEventListener(
        "click",
        stopIdentityScanner
    );


    cancelScannerButton.addEventListener(
        "click",
        stopIdentityScanner
    );

}


/* =====================================================
   IDENTITY QR SCANNER
===================================================== */

async function startIdentityScanner() {

    console.log(
        "Starting identity QR scanner..."
    );


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        showToast(
            "❌",
            "QR scanner library unavailable."
        );

        return;

    }


    qrScannerPanel.classList.remove(
        "hidden"
    );


    try {

        qrScanner =
            new Html5Qrcode(
                "qr-reader"
            );


        await qrScanner.start(

            {
                facingMode:
                    "environment"
            },

            {

                fps:
                    10,

                qrbox:
                    250

            },

            decodedText => {

                console.log(
                    "QR detected:",
                    decodedText
                );


                stopIdentityScanner();


                handleIdentityQR(
                    decodedText
                );

            },

            () => {}

        );

    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );

        showToast(
            "❌",
            "Could not start camera."
        );

        qrScannerPanel.classList.add(
            "hidden"
        );

    }

}


async function stopIdentityScanner() {

    if (qrScanner) {

        try {

            await qrScanner.stop();

            await qrScanner.clear();

        }

        catch (error) {

            console.warn(
                error
            );

        }

        qrScanner =
            null;

    }


    qrScannerPanel.classList.add(
        "hidden"
    );

}


/* =====================================================
   IDENTITY QR PROCESS
===================================================== */

function handleIdentityQR(
    text
) {

    let user;

    try {

        user =
            JSON.parse(
                text
            );

    }

    catch {

        showToast(
            "❌",
            "Invalid OVC QR."
        );

        return;

    }


    if (
        user.type !==
        "OVC_USER"
    ) {

        showToast(
            "❌",
            "Not an OVC QR."
        );

        return;

    }


    if (
        currentUser &&
        user.id ===
        currentUser.id
    ) {

        showToast(
            "😅",
            "This is your own QR."
        );

        return;

    }


    addPerson(
        user
    );


    showToast(
        "✅",
        `${user.username} added.`
    );

}


/* =====================================================
   PEOPLE
===================================================== */

function setupPeople() {

    renderPeople();

}


function loadPeople() {

    try {

        const data =
            localStorage.getItem(
                PEOPLE_KEY
            );

        if (data) {

            people =
                JSON.parse(
                    data
                );

        }

    }

    catch {

        people =
            [];

    }


    renderPeople();

}


function savePeople() {

    localStorage.setItem(

        PEOPLE_KEY,

        JSON.stringify(
            people
        )

    );

}


function addPerson(
    user
) {

    if (
        people.some(
            p =>
                p.id ===
                user.id
        )
    ) {

        return;

    }


    people.push({

        id:
            user.id,

        username:
            user.username,

        avatar:
            user.avatar ||
            "👤"

    });


    savePeople();

    renderPeople();

}


function renderPeople() {

    peopleList.innerHTML =
        "";


    if (
        people.length ===
        0
    ) {

        emptyPeople.style.display =
            "block";

        return;

    }


    emptyPeople.style.display =
        "none";


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
                    ${person.avatar}
                </div>

                <div class="person-info">

                    <h3>
                        ${escapeHTML(
                            person.username
                        )}
                    </h3>

                    <span>
                        🟢 LAN User
                    </span>

                </div>

                <button>
                    📹 Call
                </button>

            `;


            card
                .querySelector(
                    "button"
                )
                .addEventListener(
                    "click",
                    () => {

                        startOutgoingCall(
                            person
                        );

                    }
                );


            peopleList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   WEBRTC
===================================================== */

async function createConnection() {

    peerConnection =
        new RTCPeerConnection(
            rtcConfiguration
        );


    remoteStream =
        new MediaStream();


    remoteVideo.srcObject =
        remoteStream;


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
                peerConnection.connectionState;


            console.log(
                "WebRTC:",
                state
            );


            callStatus.textContent =
                state;


            if (
                state ===
                "connected"
            ) {

                startTimer();

                callStatus.textContent =
                    "Connected 🟢";

            }


            if (
                state ===
                "failed"
            ) {

                callStatus.textContent =
                    "Connection failed";

            }

        };

}


/* =====================================================
   LOCAL MEDIA
===================================================== */

async function startLocalMedia() {

    localStream =
        await navigator
            .mediaDevices
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


/* =====================================================
   OUTGOING CALL
===================================================== */

async function startOutgoingCall(
    user
) {

    currentRemoteUser =
        user;


    navigateTo(
        "video-section"
    );


    remoteUsername.textContent =
        user.username;


    callStatus.textContent =
        "Creating offer...";


    try {

        await createConnection();

        await startLocalMedia();


        const offer =
            await peerConnection
                .createOffer();


        await peerConnection
            .setLocalDescription(
                offer
            );


        /*
           Wait for ICE gathering.

           Because we have no
           signaling server.
        */

        await waitForIce();


        const data = {

            type:
                "OVC_OFFER",

            from:
                currentUser,

            offer:
                peerConnection
                    .localDescription

        };


        showSignalQR(

            "Scan this Offer QR on the other phone",

            data

        );

    }

    catch (error) {

        console.error(
            error
        );

        showToast(
            "❌",
            "Could not create call."
        );

    }

}


/* =====================================================
   ANSWER
===================================================== */

async function handleOffer(
    data
) {

    currentRemoteUser =
        data.from;


    navigateTo(
        "video-section"
    );


    remoteUsername.textContent =
        data.from.username;


    await createConnection();

    await startLocalMedia();


    await peerConnection
        .setRemoteDescription(

            new RTCSessionDescription(
                data.offer
            )

        );


    const answer =
        await peerConnection
            .createAnswer();


    await peerConnection
        .setLocalDescription(
            answer
        );


    await waitForIce();


    const response = {

        type:
            "OVC_ANSWER",

        from:
            currentUser,

        answer:
            peerConnection
                .localDescription

    };


    showSignalQR(

        "Scan this Answer QR on the caller's phone",

        response

    );

}


/* =====================================================
   ANSWER PROCESS
===================================================== */

async function handleAnswer(
    data
) {

    if (
        !peerConnection
    ) {

        return;

    }


    await peerConnection
        .setRemoteDescription(

            new RTCSessionDescription(
                data.answer
            )

        );


    closeSignalModal();


    callStatus.textContent =
        "Connecting...";

}


/* =====================================================
   ICE
===================================================== */

function waitForIce() {

    return new Promise(
        resolve => {

            if (
                peerConnection
                    .iceGatheringState ===
                "complete"
            ) {

                resolve();

                return;

            }


            const timeout =
                setTimeout(
                    resolve,
                    5000
                );


            peerConnection
                .onicegatheringstatechange =
                () => {

                    if (
                        peerConnection
                            .iceGatheringState ===
                        "complete"
                    ) {

                        clearTimeout(
                            timeout
                        );

                        resolve();

                    }

                };

        }
    );

}


/* =====================================================
   SIGNAL QR
===================================================== */

function showSignalQR(
    description,
    data
) {

    signalTitle.textContent =
        "WebRTC Connection";

    signalDescription.textContent =
        description;


    signalQr.innerHTML =
        "";


    const text =
        JSON.stringify(
            data
        );


    new QRCode(

        signalQr,

        {

            text,

            width:
                220,

            height:
                220,

            correctLevel:
                QRCode.CorrectLevel.L

        }

    );


    signalInput.value =
        "";


    signalModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   SIGNAL CONTROLS
===================================================== */

function setupSignalControls() {

    signalCloseButton
        .addEventListener(
            "click",
            closeSignalModal
        );


    signalSubmitButton
        .addEventListener(
            "click",
            () => {

                const text =
                    signalInput.value.trim();


                if (!text) {
                    return;
                }


                processSignalQR(
                    text
                );

            }
        );


    signalScanButton
        .addEventListener(
            "click",
            startSignalScanner
        );

}


function processSignalQR(
    text
) {

    let data;

    try {

        data =
            JSON.parse(
                text
            );

    }

    catch {

        showToast(
            "❌",
            "Invalid signaling data."
        );

        return;

    }


    if (
        data.type ===
        "OVC_OFFER"
    ) {

        handleOffer(
            data
        );

        return;

    }


    if (
        data.type ===
        "OVC_ANSWER"
    ) {

        handleAnswer(
            data
        );

        return;

    }


    showToast(
        "❌",
        "Unknown signaling data."
    );

}


function closeSignalModal() {

    signalModal.classList.add(
        "hidden"
    );

}


/* =====================================================
   SIGNAL SCANNER
===================================================== */

async function startSignalScanner() {

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        return;

    }


    closeSignalModal();


    const modal =
        qrScannerPanel;


    modal.classList.remove(
        "hidden"
    );


    qrReader.innerHTML =
        "";


    signalScanner =
        new Html5Qrcode(
            "qr-reader"
        );


    try {

        await signalScanner.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps:
                    10,

                qrbox:
                    250

            },

            text => {

                stopSignalScanner();

                processSignalQR(
                    text
                );

            },

            () => {}

        );

    }

    catch (error) {

        console.error(
            error
        );

        showToast(
            "❌",
            "Could not open camera."
        );

    }

}


async function stopSignalScanner() {

    if (
        signalScanner
    ) {

        try {

            await signalScanner.stop();

            await signalScanner.clear();

        }

        catch {}

        signalScanner =
            null;

    }


    qrScannerPanel.classList.add(
        "hidden"
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
        endCall
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


function endCall() {

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


    remoteVideo.srcObject =
        null;


    stopTimer();


    navigateTo(
        "home-section"
    );


    showToast(
        "👋",
        "Call ended."
    );

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    stopTimer();

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


function stopTimer() {

    clearInterval(
        callTimerInterval
    );

    callTimerInterval =
        null;

    callTimer.textContent =
        "00:00";

}


/* =====================================================
   PROFILE
===================================================== */

function setupProfile() {

    $("edit-profile")
        .addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "New name:",
                        currentUser.username
                    );


                if (
                    name &&
                    name.trim()
                ) {

                    currentUser.username =
                        name.trim();

                    saveUser();

                    updateUserUI();

                    generateUserQR();

                }

            }
        );


    $("clear-data")
        .addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Clear all OVC data?"
                    )
                ) {

                    localStorage.clear();

                    location.reload();

                }

            }
        );

}


/* =====================================================
   QR DOWNLOAD
===================================================== */

$("download-qr")
    .addEventListener(
        "click",
        () => {

            const canvas =
                qrCode.querySelector(
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
                "ovc-qr.png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        }
    );


/* =====================================================
   QR SHARE
===================================================== */

$("share-qr")
    .addEventListener(
        "click",
        async () => {

            if (
                !navigator.share
            ) {

                showToast(
                    "ℹ️",
                    "Sharing unavailable."
                );

                return;

            }


            await navigator.share({

                title:
                    "My OVC QR",

                text:
                    "Connect with me on OVC."

            });

        }
    );


/* =====================================================
   FULLSCREEN
===================================================== */

function toggleFullscreen() {

    if (
        !document.fullscreenElement
    ) {

        videoSection
            .requestFullscreen();

    }

    else {

        document.exitFullscreen();

    }

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    icon,
    message
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


/* =====================================================
   SERVICE WORKER
===================================================== */

function registerServiceWorker() {

    if (
        "serviceWorker" in navigator
    ) {

        navigator.serviceWorker
            .register(
                "sw.js"
            )
            .then(
                () => {

                    console.log(
                        "OVC offline cache ready."
                    );

                }
            )
            .catch(
                console.error
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