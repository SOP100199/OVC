/* =====================================================
   OVC - OFFLINE VIDEO CALLING
   VERSION 1.0
===================================================== */

/* =====================================================
   DOM ELEMENTS
===================================================== */

/* ---------------- LOGIN ---------------- */

const nameInput = document.getElementById("username");

const genderInput = document.getElementById("gender");

const send = document.getElementById("send");

const loginSection = document.getElementById("login-section");

const mainContent = document.getElementById("main-content");

/* ---------------- NAVIGATION ---------------- */

const navProfile = document.getElementById("nav-profile");

const navItems = document.querySelectorAll(".nav-item");

const bottomNavItems = document.querySelectorAll(".bottom-nav-item");

const sections = document.querySelectorAll(".page-section");

/* ---------------- PROFILE ---------------- */

const homeUsername = document.getElementById("home-username");

const profileUsername = document.getElementById("profile-username");

const qrUsername = document.getElementById("qr-username");

const homeAvatar = document.getElementById("home-avatar");

const profileAvatar = document.getElementById("profile-avatar");

/* ---------------- GIFS ---------------- */

const loginGif = document.getElementById("login-gif");

const statusGif = document.getElementById("status-gif");

const callGif = document.getElementById("call-gif");

const botMessage = document.getElementById("bot-message");

const homeBotMessage = document.getElementById("home-bot-message");

/* ---------------- QR ---------------- */

const qrCode = document.getElementById("qr-code");

const myQrTab = document.getElementById("my-qr-tab");

const scanQrTab = document.getElementById("scan-qr-tab");

const myQrPanel = document.getElementById("my-qr-panel");

const scanQrPanel = document.getElementById("scan-qr-panel");

const startScan = document.getElementById("start-scan");

const shareQr = document.getElementById("share-qr");

const downloadQr = document.getElementById("download-qr");

const qrReader = document.getElementById("qr-reader");

/* ---------------- PEOPLE ---------------- */

const peopleList = document.getElementById("people-list");

const emptyPeople = document.getElementById("empty-people");

const connectionStatus = document.getElementById("connection-status");

/* ---------------- VIDEO ---------------- */

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

/* ---------------- INCOMING CALL ---------------- */

const incomingCallModal = document.getElementById("incoming-call-modal");

const callerName = document.getElementById("caller-name");

const acceptCall = document.getElementById("accept-call");

const rejectCall = document.getElementById("reject-call");

/* ---------------- CONNECTION MODAL ---------------- */

const connectionModal = document.getElementById("connection-modal");

const connectionUserName = document.getElementById("connection-user-name");

const connectionUserAvatar = document.getElementById("connection-user-avatar");

const closeConnectionModal = document.getElementById("close-connection-modal");

const rejectConnection = document.getElementById("reject-connection");

const acceptConnection = document.getElementById("accept-connection");

/* ---------------- SETTINGS ---------------- */

const vibrationToggle = document.getElementById("vibration-toggle");

const notificationToggle = document.getElementById("notification-toggle");

const gifToggle = document.getElementById("gif-toggle");

const clearData = document.getElementById("clear-data");

const settingsProfile = document.getElementById("settings-profile");

const editProfile = document.getElementById("edit-profile");

/* ---------------- INSTALL ---------------- */

const installPrompt = document.getElementById("install-prompt");

const installButton = document.getElementById("install-button");

const closeInstall = document.getElementById("close-install");

/* ---------------- TOAST ---------------- */

const toast = document.getElementById("toast");

const toastIcon = document.getElementById("toast-icon");

const toastMessage = document.getElementById("toast-message");

/* =====================================================
   CONFIGURATION
===================================================== */

const OVC_VERSION = "1.0.0";

const STORAGE_KEY = "ovc-user";

const SETTINGS_KEY = "ovc-settings";

const PEOPLE_STORAGE_KEY = "ovc-people";

/* =====================================================
   GIFS
===================================================== */

const gifs = {
  welcome: "assets/gifs/welcome.gif",

  calling: "assets/gifs/calling.gif",

  celebrating: "assets/gifs/celebrating.gif",

  confused: "assets/gifs/confused.gif",

  connectionlost: "assets/gifs/connectionlost.gif",

  dancing: "assets/gifs/dancing.gif",

  excited: "assets/gifs/excited.gif",

  goodbye: "assets/gifs/goodbye.gif",

  laughing: "assets/gifs/laughing.gif",

  shocked: "assets/gifs/shocked.gif",

  success: "assets/gifs/success.gif",

  talking: "assets/gifs/talking.gif",

  thinking: "assets/gifs/thinking.gif",
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

  "Let's get you connected! 📡",
];

let messageIndex = 0;

/* =====================================================
   AVATARS
===================================================== */

const userProfileBoyImages = ["🧑‍🎄", "🕵️‍♂️", "💂‍♂️", "🥷", "👨‍🎓", "🧑‍🚀", "🧙‍♂️"];

const userProfileGirlImages = ["👩‍🎄", "🕵️‍♀️", "💂‍♀️", "🥷", "👩‍🎓", "🧑‍🚀", "🧙‍♀️"];

/* =====================================================
   APPLICATION STATE
===================================================== */

let currentUser = null;

let currentSettings = {
  vibration: true,

  notifications: true,

  gifs: true,
};

let people = [];

let currentConnectionUser = null;

/* =====================================================
   VIDEO / WEBRTC STATE
===================================================== */

let localStream = null;

let remoteStream = null;

let peerConnection = null;

let callStartTime = null;

let callTimerInterval = null;

let isMuted = false;

let isCameraOff = false;

/* =====================================================
   QR SCANNER STATE
===================================================== */

let qrScanner = null;

let scannerRunning = false;

/* =====================================================
   PWA STATE
===================================================== */

let deferredInstallPrompt = null;

/* =====================================================
   WEBRTC CONFIGURATION
===================================================== */

const rtcConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", initializeOVC);

function initializeOVC() {
  console.log(`OVC v${OVC_VERSION} initializing...`);

  loadSettings();

  loadStoredUser();

  loadPeople();

  setupNavigation();

  setupLogin();

  setupQRInterface();

  setupQRScanner();

  setupCallControls();

  setupSettings();

  setupInstallPrompt();

  setupPWAEvents();

  setupServiceWorker();

  setupConnectionControls();

  setupIncomingCallControls();

  updateBotMessage();

  console.log(`OVC v${OVC_VERSION} initialized.`);
}

/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {
  if (!send) {
    return;
  }

  send.addEventListener("click", loginUser);

  if (nameInput) {
    nameInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        loginUser();
      }
    });
  }
}

function loginUser() {
  if (!nameInput) {
    return;
  }

  const username = nameInput.value.trim();

  if (!username) {
    showToast("⚠️", "Please enter your name.");

    vibrate([100, 50, 100]);

    nameInput.focus();

    return;
  }

  const gender = genderInput ? genderInput.value : "male";

  const avatar = generateAvatar(gender);

  currentUser = {
    id: generateUserId(),

    username: username,

    gender: gender,

    avatar: avatar,

    createdAt: Date.now(),

    version: OVC_VERSION,
  };

  saveUser();

  updateUserInterface();

  if (loginSection) {
    loginSection.classList.add("hidden");
  }

  if (mainContent) {
    mainContent.classList.remove("hidden");
  }

  setStatus("success");

  showToast("🎉", `Welcome ${username}!`);

  vibrate([100, 50, 100]);

  navigateTo("home-section");
}

function generateUserId() {
  return (
    "ovc-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).substring(2, 9)
  );
}

function generateAvatar(gender) {
  const avatars =
    gender === "female" ? userProfileGirlImages : userProfileBoyImages;

  const index = Math.floor(Math.random() * avatars.length);

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

    JSON.stringify(currentUser),
  );
}

function loadStoredUser() {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
      return;
    }

    currentUser = JSON.parse(storedUser);

    if (!currentUser || !currentUser.username) {
      currentUser = null;

      return;
    }

    updateUserInterface();

    if (loginSection) {
      loginSection.classList.add("hidden");
    }

    if (mainContent) {
      mainContent.classList.remove("hidden");
    }
  } catch (error) {
    console.error("OVC user loading error:", error);

    localStorage.removeItem(STORAGE_KEY);

    currentUser = null;
  }
}

/* =====================================================
   UPDATE USER UI
===================================================== */

function updateUserInterface() {
  if (!currentUser) {
    return;
  }

  if (homeUsername) {
    homeUsername.textContent = currentUser.username;
  }

  if (profileUsername) {
    profileUsername.textContent = currentUser.username;
  }

  if (qrUsername) {
    qrUsername.textContent = currentUser.username;
  }

  if (homeAvatar) {
    homeAvatar.textContent = currentUser.avatar;
  }

  if (profileAvatar) {
    profileAvatar.textContent = currentUser.avatar;
  }

  generateUserQR();
}

/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navigateTo(this.dataset.section);
    });
  });

  bottomNavItems.forEach((item) => {
    item.addEventListener("click", function () {
      navigateTo(this.dataset.section);
    });
  });

  if (navProfile) {
    navProfile.addEventListener("click", function () {
      navigateTo("profile-section");
    });
  }

  document.querySelectorAll("[data-section]").forEach((button) => {
    if (
      button.classList.contains("nav-item") ||
      button.classList.contains("bottom-nav-item")
    ) {
      return;
    }

    button.addEventListener("click", function () {
      navigateTo(this.dataset.section);
    });
  });
}

function navigateTo(sectionId) {
  sections.forEach((section) => {
    section.classList.remove("active-section");
  });

  const target = document.getElementById(sectionId);

  if (!target) {
    console.warn("Section not found:", sectionId);

    return;
  }

  target.classList.add("active-section");

  navItems.forEach((item) => {
    item.classList.toggle(
      "active",

      item.dataset.section === sectionId,
    );
  });

  bottomNavItems.forEach((item) => {
    item.classList.toggle(
      "active",

      item.dataset.section === sectionId,
    );
  });

  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
}

/* =====================================================
   QR INTERFACE
===================================================== */

function setupQRInterface() {
  if (myQrTab && myQrPanel && scanQrPanel) {
    myQrTab.addEventListener("click", function () {
      myQrTab.classList.add("active");

      if (scanQrTab) {
        scanQrTab.classList.remove("active");
      }

      myQrPanel.classList.add("active");

      scanQrPanel.classList.remove("active");
    });
  }

  if (scanQrTab && scanQrPanel && myQrPanel) {
    scanQrTab.addEventListener("click", function () {
      scanQrTab.classList.add("active");

      if (myQrTab) {
        myQrTab.classList.remove("active");
      }

      scanQrPanel.classList.add("active");

      myQrPanel.classList.remove("active");
    });
  }

  if (shareQr) {
    shareQr.addEventListener("click", shareUserQR);
  }

  if (downloadQr) {
    downloadQr.addEventListener("click", downloadUserQR);
  }
}

/* =====================================================
   QR GENERATION
===================================================== */

function generateUserQR() {

    if (!qrCode || !currentUser) {
        console.log("QR element or user not available");
        return;
    }

    // Clear previous QR
    qrCode.innerHTML = "";

    // MINIMAL QR DATA
    const qrData = {
        type: "OVC_USER",
        id: currentUser.id,
        username: currentUser.username
    };

    const qrText = JSON.stringify(qrData);

    console.log("Generating QR:", qrText);

    if (typeof QRCode === "undefined") {

        console.error("QRCode library not found!");

        qrCode.innerHTML = `
            <div class="qr-error">
                ⚠️ QR generator unavailable
            </div>
        `;

        return;
    }

    try {

        new QRCode(qrCode, {
            text: qrText,
            width: 220,
            height: 220,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        });

        console.log("✅ QR generated successfully");

    } catch (error) {

        console.error(
            "QR generation error:",
            error
        );

        qrCode.innerHTML = `
            <div class="qr-error">
                ❌ Failed to generate QR
            </div>
        `;

    }
}

/* =====================================================
   QR SHARE
===================================================== */

async function shareUserQR() {
  if (!currentUser) {
    showToast("⚠️", "Please log in first.");

    return;
  }

  if (!qrCode) {
    return;
  }

  const canvas = qrCode.querySelector("canvas");

  if (!canvas) {
    showToast("⚠️", "QR code is not ready.");

    return;
  }

  try {
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!blob) {
      throw new Error("Failed to create QR image.");
    }

    const file = new File(
      [blob],

      `${currentUser.username}-OVC-QR.png`,

      {
        type: "image/png",
      },
    );

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file],
      })
    ) {
      await navigator.share({
        title: "Connect with me on OVC",

        text: `Scan my OVC QR code to connect with ${currentUser.username}.`,

        files: [file],
      });

      showToast("📤", "QR code shared!");
    } else if (navigator.share) {
      await navigator.share({
        title: "Connect with me on OVC",

        text: `Connect with ${currentUser.username} on OVC.`,
      });
    } else {
      showToast(
        "ℹ️",

        "Sharing is not supported on this browser.",
      );
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("QR sharing error:", error);

      showToast("❌", "Unable to share QR code.");
    }
  }
}

/* =====================================================
   QR DOWNLOAD
===================================================== */

function downloadUserQR() {
  if (!currentUser || !qrCode) {
    return;
  }

  const canvas = qrCode.querySelector("canvas");

  if (!canvas) {
    showToast("⚠️", "QR code is not ready.");

    return;
  }

  const link = document.createElement("a");

  link.download = `${currentUser.username}-OVC-QR.png`;

  link.href = canvas.toDataURL("image/png");

  link.click();

  showToast("💾", "QR code saved!");
}

/* =====================================================
   QR SCANNER SETUP
===================================================== */

function setupQRScanner() {
  if (!startScan) {
    console.warn("#start-scan button not found.");

    return;
  }

  startScan.addEventListener("click", openQRScanner);
}

/* =====================================================
   OPEN QR SCANNER
===================================================== */

async function openQRScanner() {
  console.log("📷 Start Scanner clicked.");

  if (typeof Html5Qrcode === "undefined") {
    console.error("Html5Qrcode library not loaded.");

    showToast("⚠️", "QR scanner library not loaded.");

    return;
  }

  if (scannerRunning) {
    console.log("Scanner already running.");

    return;
  }

  if (!qrReader) {
    console.error("#qr-reader not found.");

    showToast("❌", "QR scanner area not found.");

    return;
  }

  qrReader.innerHTML = "";

  qrScanner = new Html5Qrcode("qr-reader");

  try {
    await qrScanner.start(
      {
        facingMode: "environment",
      },

      {
        fps: 10,

        qrbox: {
          width: 250,

          height: 250,
        },
      },

      function (decodedText) {
        console.log("✅ QR detected:", decodedText);

        handleQRScan(decodedText);
      },

      function (errorMessage) {
        // Normal scanning process.
        // QR not detected yet.
      },
    );

    scannerRunning = true;

    startScan.textContent = "⏹️ Stop Scanner";

    startScan.removeEventListener("click", openQRScanner);

    startScan.addEventListener("click", closeQRScanner);

    showToast("📷", "Camera started. Scan an OVC QR code.");

    console.log("✅ QR scanner started.");
  } catch (error) {
    console.error("❌ Camera failed:", error);

    qrScanner = null;

    scannerRunning = false;

    qrReader.innerHTML = `

            <div class="scanner-placeholder">

                ❌

                <p>
                    Could not open camera.
                </p>

                <small>
                    Check camera permissions.
                </small>

            </div>

        `;

    showToast("❌", "Could not open camera.");
  }
}

/* =====================================================
   HANDLE QR SCAN
===================================================== */

async function handleQRScan(decodedText) {
  console.log("📦 QR data:", decodedText);

  let userData;

  try {
    userData = JSON.parse(decodedText);
  } catch (error) {
    console.error("Invalid QR JSON:", error);

    showToast("❌", "Invalid QR code.");

    return;
  }

  if (!userData || userData.type !== "OVC_USER") {
    showToast("❌", "This is not an OVC QR code.");

    return;
  }

  if (!userData.id || !userData.username) {
    showToast("❌", "Invalid OVC profile.");

    return;
  }

  if (currentUser && userData.id === currentUser.id) {
    showToast("😅", "That's your own QR code!");

    return;
  }

  console.log("✅ Valid OVC user:", userData.username);

  await closeQRScanner();

  addPerson(userData);

  showToast(
    "✅",

    `${userData.username} added to People!`,
  );

  vibrate([100, 50, 100]);
}

/* =====================================================
   CLOSE QR SCANNER
===================================================== */

async function closeQRScanner() {
  if (qrScanner && scannerRunning) {
    try {
      await qrScanner.stop();

      console.log("📷 Scanner stopped.");
    } catch (error) {
      console.error("Scanner stop error:", error);
    }
  }

  if (qrScanner) {
    try {
      qrScanner.clear();
    } catch (error) {
      console.log("Scanner already cleared.");
    }
  }

  qrScanner = null;

  scannerRunning = false;

  if (qrReader) {
    qrReader.innerHTML = `

            <div class="scanner-placeholder">

                📷

                <p>
                    Camera scanner
                </p>

            </div>

        `;
  }

  if (startScan) {
    startScan.textContent = "📷 Start Scanner";

    startScan.removeEventListener("click", closeQRScanner);

    startScan.addEventListener("click", openQRScanner);
  }
}

/* =====================================================
   PEOPLE STORAGE
===================================================== */

function loadPeople() {
  try {
    const savedPeople = localStorage.getItem(PEOPLE_STORAGE_KEY);

    if (savedPeople) {
      people = JSON.parse(savedPeople);
    }

    if (!Array.isArray(people)) {
      people = [];
    }

    renderPeople();
  } catch (error) {
    console.error("Failed to load people:", error);

    people = [];
  }
}

function savePeople() {
  localStorage.setItem(
    PEOPLE_STORAGE_KEY,

    JSON.stringify(people),
  );
}

/* =====================================================
   ADD PERSON
===================================================== */

function addPerson(user) {
  if (!user || !user.id || !user.username) {
    showToast("⚠️", "Invalid OVC user.");

    return;
  }

  if (currentUser && user.id === currentUser.id) {
    showToast("😅", "That's you!");

    return;
  }

  const alreadyExists = people.some((person) => person.id === user.id);

  if (alreadyExists) {
    showToast(
      "👋",

      `${user.username} is already connected.`,
    );

    return;
  }

  const newPerson = {
    id: user.id,

    username: user.username,

    avatar: user.avatar || "👤",

    status: "available",

    addedAt: Date.now(),
  };

  people.push(newPerson);

  savePeople();

  renderPeople();

  showToast(
    "✅",

    `${user.username} added to People!`,
  );

  vibrate([100, 50, 100]);
}

/* =====================================================
   RENDER PEOPLE
===================================================== */

function renderPeople() {
  if (!peopleList) {
    return;
  }

  peopleList.querySelectorAll(".person-card").forEach((card) => card.remove());

  if (people.length === 0) {
    if (emptyPeople) {
      emptyPeople.style.display = "flex";
    }

    return;
  }

  if (emptyPeople) {
    emptyPeople.style.display = "none";
  }

  people.forEach((person) => {
    const card = document.createElement("div");

    card.className = "person-card";

    card.innerHTML = `

                <div class="person-avatar">

                    ${escapeHTML(person.avatar || "👤")}

                </div>

                <div class="person-info">

                    <h3>
                        ${escapeHTML(person.username)}
                    </h3>

                    <span class="person-status">
                        🟢 Available
                    </span>

                </div>

                <button
                    class="call-person-button"
                    aria-label="Call ${escapeHTML(person.username)}"
                >
                    📹
                </button>

            `;

    peopleList.appendChild(card);

    const callButton = card.querySelector(".call-person-button");

    if (callButton) {
      callButton.addEventListener("click", function () {
        requestCall(person);
      });
    }
  });
}

/* =====================================================
   REMOVE PERSON
===================================================== */

function removePerson(userId) {
  people = people.filter((person) => person.id !== userId);

  savePeople();

  renderPeople();

  showToast("🗑️", "Connection removed.");
}

/* =====================================================
   CONNECTION MODAL
===================================================== */

function setupConnectionControls() {
  if (closeConnectionModal) {
    closeConnectionModal.addEventListener("click", closeConnectionRequest);
  }

  if (rejectConnection) {
    rejectConnection.addEventListener("click", closeConnectionRequest);
  }

  if (acceptConnection) {
    acceptConnection.addEventListener("click", async function () {
      if (!currentConnectionUser) {
        return;
      }

      const user = currentConnectionUser;

      connectionModal.classList.add("hidden");

      await startCall(user);
    });
  }
}

function requestCall(user) {
  if (!user) {
    return;
  }

  currentConnectionUser = user;

  if (connectionUserName) {
    connectionUserName.textContent = user.username;
  }

  if (connectionUserAvatar) {
    connectionUserAvatar.textContent = user.avatar || "👤";
  }

  if (connectionModal) {
    connectionModal.classList.remove("hidden");
  }

  vibrate([100, 50, 100]);
}

function closeConnectionRequest() {
  if (connectionModal) {
    connectionModal.classList.add("hidden");
  }

  currentConnectionUser = null;
}

/* =====================================================
   VIDEO CALL CONTROLS
===================================================== */

function setupCallControls() {
  if (muteButton) {
    muteButton.addEventListener("click", toggleMute);
  }

  if (cameraButton) {
    cameraButton.addEventListener("click", toggleCamera);
  }

  if (endCallButton) {
    endCallButton.addEventListener("click", endCall);
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullscreen);
  }
}

/* =====================================================
   START CALL
===================================================== */

async function startCall(user) {
  try {
    navigateTo("video-section");

    if (callStatus) {
      callStatus.textContent = "Requesting camera and microphone...";
    }

    if (callGif) {
      callGif.src = gifs.calling;
    }

    await startLocalMedia();

    createPeerConnection();

    if (remoteUsername) {
      remoteUsername.textContent = user.username;
    }

    if (callStatus) {
      callStatus.textContent = "Connecting...";
    }

    showToast("📡", "Waiting for connection...");

    /*
     * IMPORTANT:
     *
     * Actual WebRTC connection requires:
     *
     * 1. SDP Offer
     * 2. SDP Answer
     * 3. ICE Candidate exchange
     *
     * Signaling is not implemented yet.
     */
  } catch (error) {
    console.error("OVC call error:", error);

    showToast("❌", "Unable to start camera or microphone.");
  }
}

/* =====================================================
   LOCAL MEDIA
===================================================== */

async function startLocalMedia() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera API unavailable.");
  }

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,

    audio: true,
  });

  if (localVideo) {
    localVideo.srcObject = localStream;
  }

  if (localPlaceholder) {
    localPlaceholder.classList.add("hidden");
  }
}

/* =====================================================
   WEBRTC PEER CONNECTION
===================================================== */

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(rtcConfiguration);

  remoteStream = new MediaStream();

  if (remoteVideo) {
    remoteVideo.srcObject = remoteStream;
  }

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(
        track,

        localStream,
      );
    });
  }

  peerConnection.ontrack = function (event) {
    if (event.streams && event.streams[0]) {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    }

    if (remotePlaceholder) {
      remotePlaceholder.classList.add("hidden");
    }
  };

  peerConnection.onconnectionstatechange = function () {
    if (!peerConnection) {
      return;
    }

    const state = peerConnection.connectionState;

    console.log("OVC WebRTC state:", state);

    if (state === "connected") {
      if (callStatus) {
        callStatus.textContent = "Connected 🟢";
      }

      if (callGif) {
        callGif.src = gifs.success;
      }

      startCallTimer();

      vibrate([100]);
    }

    if (state === "disconnected" || state === "failed") {
      if (callStatus) {
        callStatus.textContent = "Connection lost";
      }

      if (callGif) {
        callGif.src = gifs.connectionlost;
      }
    }
  };

  peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      console.log("ICE candidate:", event.candidate);

      /*
       * Send candidate
       * through signaling
       * here.
       */
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

  const audioTracks = localStream.getAudioTracks();

  audioTracks.forEach((track) => {
    track.enabled = !track.enabled;
  });

  isMuted = !isMuted;

  if (muteButton) {
    muteButton.textContent = isMuted ? "🔇" : "🎤";

    muteButton.classList.toggle(
      "active",

      isMuted,
    );
  }

  vibrate([50]);
}

/* =====================================================
   CAMERA
===================================================== */

function toggleCamera() {
  if (!localStream) {
    return;
  }

  const videoTracks = localStream.getVideoTracks();

  videoTracks.forEach((track) => {
    track.enabled = !track.enabled;
  });

  isCameraOff = !isCameraOff;

  if (cameraButton) {
    cameraButton.textContent = isCameraOff ? "📷" : "🎥";

    cameraButton.classList.toggle(
      "active",

      isCameraOff,
    );
  }

  if (localPlaceholder) {
    localPlaceholder.classList.toggle(
      "hidden",

      !isCameraOff,
    );
  }

  vibrate([50]);
}

/* =====================================================
   END CALL
===================================================== */

function endCall() {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());

    localStream = null;
  }

  if (peerConnection) {
    peerConnection.close();

    peerConnection = null;
  }

  if (remoteVideo) {
    remoteVideo.srcObject = null;
  }

  stopCallTimer();

  if (callStatus) {
    callStatus.textContent = "Call ended";
  }

  if (callGif) {
    callGif.src = gifs.goodbye;
  }

  showToast("👋", "Call ended.");

  vibrate([100, 50, 100]);

  setTimeout(function () {
    navigateTo("home-section");
  }, 1200);
}

/* =====================================================
   CALL TIMER
===================================================== */

function startCallTimer() {
  callStartTime = Date.now();

  stopCallTimer();

  callStartTime = Date.now();

  callTimerInterval = setInterval(
    updateCallTimer,

    1000,
  );
}

function updateCallTimer() {
  if (!callStartTime) {
    return;
  }

  const elapsed = Date.now() - callStartTime;

  const seconds = Math.floor(elapsed / 1000);

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  if (callTimer) {
    callTimer.textContent =
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0");
  }
}

function stopCallTimer() {
  if (callTimerInterval) {
    clearInterval(callTimerInterval);

    callTimerInterval = null;
  }

  callStartTime = null;

  if (callTimer) {
    callTimer.textContent = "00:00";
  }
}

/* =====================================================
   FULLSCREEN
===================================================== */

function toggleFullscreen() {
  if (!videoSection) {
    return;
  }

  if (!document.fullscreenElement) {
    videoSection.requestFullscreen().catch((error) => {
      console.error(error);
    });
  } else {
    document.exitFullscreen();
  }
}

/* =====================================================
   SETTINGS
===================================================== */

function setupSettings() {
  if (vibrationToggle) {
    vibrationToggle.addEventListener("change", function () {
      currentSettings.vibration = this.checked;

      saveSettings();
    });
  }

  if (notificationToggle) {
    notificationToggle.addEventListener("change", function () {
      currentSettings.notifications = this.checked;

      saveSettings();
    });
  }

  if (gifToggle) {
    gifToggle.addEventListener("change", function () {
      currentSettings.gifs = this.checked;

      saveSettings();
    });
  }

  if (clearData) {
    clearData.addEventListener("click", clearOVCData);
  }

  if (editProfile) {
    editProfile.addEventListener("click", editUserProfile);
  }

  if (settingsProfile) {
    settingsProfile.addEventListener("click", function () {
      navigateTo("profile-section");
    });
  }
}

function saveSettings() {
  localStorage.setItem(
    SETTINGS_KEY,

    JSON.stringify(currentSettings),
  );
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (saved) {
      currentSettings = {
        ...currentSettings,

        ...JSON.parse(saved),
      };
    }

    if (vibrationToggle) {
      vibrationToggle.checked = currentSettings.vibration;
    }

    if (notificationToggle) {
      notificationToggle.checked = currentSettings.notifications;
    }

    if (gifToggle) {
      gifToggle.checked = currentSettings.gifs;
    }
  } catch (error) {
    console.error("Settings error:", error);
  }
}

/* =====================================================
   EDIT PROFILE
===================================================== */

function editUserProfile() {
  if (!currentUser) {
    return;
  }

  const newName = prompt(
    "Enter your new username:",

    currentUser.username,
  );

  if (!newName || !newName.trim()) {
    return;
  }

  currentUser.username = newName.trim();

  saveUser();

  updateUserInterface();

  showToast("✅", "Profile updated.");
}

/* =====================================================
   CLEAR DATA
===================================================== */

function clearOVCData() {
  const confirmed = confirm("Clear all OVC local data?");

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  localStorage.removeItem(SETTINGS_KEY);

  localStorage.removeItem(PEOPLE_STORAGE_KEY);

  currentUser = null;

  people = [];

  location.reload();
}

/* =====================================================
   VIBRATION
===================================================== */

function vibrate(pattern) {
  if (!currentSettings.vibration) {
    return;
  }

  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.log("Vibration unavailable.");
    }
  }
}

/* =====================================================
   GIF STATUS
===================================================== */

function setStatus(status) {
  if (!currentSettings.gifs) {
    return;
  }

  const gifMap = {
    success: gifs.success,

    calling: gifs.calling,

    connectionlost: gifs.connectionlost,

    goodbye: gifs.goodbye,

    thinking: gifs.thinking,

    excited: gifs.excited,

    dancing: gifs.dancing,
  };

  if (statusGif && gifMap[status]) {
    statusGif.src = gifMap[status];
  }
}

/* =====================================================
   BOT MESSAGES
===================================================== */

function updateBotMessage() {
  if (!botMessage) {
    return;
  }

  botMessage.textContent = messages[messageIndex];

  messageIndex = (messageIndex + 1) % messages.length;
}

setInterval(updateBotMessage, 5000);

/* =====================================================
   TOAST
===================================================== */

let toastTimeout;

function showToast(icon, message) {
  if (!toast) {
    return;
  }

  if (toastIcon) {
    toastIcon.textContent = icon;
  }

  if (toastMessage) {
    toastMessage.textContent = message;
  }

  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(
    function () {
      toast.classList.remove("show");
    },

    3500,
  );
}

/* =====================================================
   PWA INSTALL
===================================================== */

function setupInstallPrompt() {
  if (!installPrompt) {
    return;
  }

  installPrompt.classList.add("hidden");

  if (installButton) {
    installButton.addEventListener("click", installOVC);
  }

  if (closeInstall) {
    closeInstall.addEventListener("click", function () {
      installPrompt.classList.add("hidden");
    });
  }
}

function setupPWAEvents() {
  window.addEventListener(
    "beforeinstallprompt",

    function (event) {
      event.preventDefault();

      deferredInstallPrompt = event;

      if (installPrompt) {
        installPrompt.classList.remove("hidden");
      }
    },
  );

  window.addEventListener(
    "appinstalled",

    function () {
      deferredInstallPrompt = null;

      if (installPrompt) {
        installPrompt.classList.add("hidden");
      }

      showToast("🎉", "OVC installed successfully!");
    },
  );
}

async function installOVC() {
  if (!deferredInstallPrompt) {
    showToast(
      "ℹ️",

      "OVC installation is not available right now.",
    );

    return;
  }

  deferredInstallPrompt.prompt();

  const result = await deferredInstallPrompt.userChoice;

  console.log("OVC install result:", result.outcome);

  deferredInstallPrompt = null;

  if (installPrompt) {
    installPrompt.classList.add("hidden");
  }
}

/* =====================================================
   SERVICE WORKER
===================================================== */

function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener(
    "load",

    function () {
      navigator.serviceWorker
        .register("./sw.js")

        .then((registration) => {
          console.log(
            "OVC Service Worker registered:",

            registration.scope,
          );
        })

        .catch((error) => {
          console.error(
            "Service Worker registration failed:",

            error,
          );
        });
    },
  );
}

/* =====================================================
   INCOMING CALL
===================================================== */

function setupIncomingCallControls() {
  if (acceptCall) {
    acceptCall.addEventListener("click", async function () {
      if (incomingCallModal) {
        incomingCallModal.classList.add("hidden");
      }

      if (currentConnectionUser) {
        await startCall(currentConnectionUser);
      }
    });
  }

  if (rejectCall) {
    rejectCall.addEventListener(
      "click",

      function () {
        if (incomingCallModal) {
          incomingCallModal.classList.add("hidden");
        }

        vibrate([100]);
      },
    );
  }
}

function showIncomingCall(user) {
  if (!user) {
    return;
  }

  currentConnectionUser = user;

  if (callerName) {
    callerName.textContent = user.username;
  }

  if (incomingCallModal) {
    incomingCallModal.classList.remove("hidden");
  }

  if (callGif) {
    callGif.src = gifs.calling;
  }

  vibrate([300, 150, 300, 150, 300]);
}

/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = String(value);

  return div.innerHTML;
}

/* =====================================================
   PAGE VISIBILITY
===================================================== */

document.addEventListener(
  "visibilitychange",

  function () {
    if (document.hidden) {
      console.log("OVC moved to background.");
    } else {
      console.log("OVC returned to foreground.");
    }
  },
);

/* =====================================================
   BEFORE UNLOAD
===================================================== */

window.addEventListener(
  "beforeunload",

  function () {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  },
);
