/* =====================================================
   OVC - OFFLINE VIDEO CALLING
   FINAL CLIENT SCRIPT
   VERSION 1.0
===================================================== */

/* =====================================================
   CONFIGURATION
===================================================== */

const OVC_VERSION = "1.0.0";

const STORAGE_KEY = "ovc-user";

const SETTINGS_KEY = "ovc-settings";

const PEOPLE_STORAGE_KEY = "ovc-people";

const SIGNALING_SERVER = "https://ovc-signaling.onrender.com";

/* =====================================================
   DOM ELEMENTS
===================================================== */

/* Login */

const nameInput = document.getElementById("username");

const genderInput = document.getElementById("gender");

const send = document.getElementById("send");

const loginSection = document.getElementById("login-section");

const mainContent = document.getElementById("main-content");

/* Navigation */

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

const openScanner = document.getElementById("open-scanner");

const qrScannerPanel = document.getElementById("qr-scanner-panel");

const closeScanner = document.getElementById("close-scanner");

const cancelScanner = document.getElementById("cancel-scanner");

const scanResult = document.getElementById("scan-result");

const shareQr = document.getElementById("share-qr");

const downloadQr = document.getElementById("download-qr");

const qrReader = document.getElementById("qr-reader");

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

const incomingCallModal = document.getElementById("incoming-call-modal");

const callerName = document.getElementById("caller-name");

const acceptCall = document.getElementById("accept-call");

const rejectCall = document.getElementById("reject-call");

/* Connection Modal */

const connectionModal = document.getElementById("connection-modal");

const connectionUserName = document.getElementById("connection-user-name");

const connectionUserAvatar = document.getElementById("connection-user-avatar");

const closeConnectionModal = document.getElementById("close-connection-modal");

const rejectConnection = document.getElementById("reject-connection");

const acceptConnection = document.getElementById("accept-connection");

/* Settings */

const vibrationToggle = document.getElementById("vibration-toggle");

const notificationToggle = document.getElementById("notification-toggle");

const gifToggle = document.getElementById("gif-toggle");

const clearData = document.getElementById("clear-data");

const settingsProfile = document.getElementById("settings-profile");

const editProfile = document.getElementById("edit-profile");

/* Install */

const installPrompt = document.getElementById("install-prompt");

const installButton = document.getElementById("install-button");

const closeInstall = document.getElementById("close-install");

/* Toast */

const toast = document.getElementById("toast");

const toastIcon = document.getElementById("toast-icon");

const toastMessage = document.getElementById("toast-message");

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

let localStream = null;

let remoteStream = null;

let peerConnection = null;

let callStartTime = null;

let callTimerInterval = null;

let isMuted = false;

let isCameraOff = false;

let deferredInstallPrompt = null;

let currentConnectionUser = null;

let pendingConnectionRequest = null;

let currentCallUser = null;

let qrScanner = null;

let socket = null;

let isSocketConnected = false;

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

  "Let's get you connected! 📡",

  "Communication without limits! 🚀",
];

let messageIndex = 0;

/* =====================================================
   AVATARS
===================================================== */

const userProfileBoyImages = ["🧑‍🎄", "🕵️‍♂️", "💂‍♂️", "🥷", "👨‍🎓", "🧑‍🚀", "🧙‍♂️"];

const userProfileGirlImages = ["👩‍🎄", "🕵️‍♀️", "💂‍♀️", "🥷", "👩‍🎓", "🧑‍🚀", "🧙‍♀️"];

/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", initializeOVC);

function initializeOVC() {
  loadSettings();

  loadPeople();

  setupNavigation();

  setupLogin();

  setupQRInterface();

  setupCallControls();

  setupSettings();

  setupInstallPrompt();

  setupPWAEvents();

  setupServiceWorker();

  setupConnectionButtons();

  loadStoredUser();

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

  currentUser = {
    id: generateUserId(),

    username: username,

    gender: gender,

    avatar: generateAvatar(gender),

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

  connectToSignalingServer();
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

    if (!currentUser || !currentUser.username || !currentUser.id) {
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

    connectToSignalingServer();
  } catch (error) {
    console.error("OVC user loading error:", error);

    localStorage.removeItem(STORAGE_KEY);

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
  if (myQrTab) {
    myQrTab.addEventListener("click", function () {
      myQrTab.classList.add("active");

      if (scanQrTab) {
        scanQrTab.classList.remove("active");
      }

      if (myQrPanel) {
        myQrPanel.classList.add("active");
      }

      if (scanQrPanel) {
        scanQrPanel.classList.remove("active");
      }
    });
  }

  if (scanQrTab) {
    scanQrTab.addEventListener("click", function () {
      scanQrTab.classList.add("active");

      if (myQrTab) {
        myQrTab.classList.remove("active");
      }

      if (scanQrPanel) {
        scanQrPanel.classList.add("active");
      }

      if (myQrPanel) {
        myQrPanel.classList.remove("active");
      }
    });
  }

  if (startScan) {
    startScan.addEventListener("click", openQRScanner);
  }

  if (openScanner) {
    openScanner.addEventListener("click", openQRScanner);
  }

  if (closeScanner) {
    closeScanner.addEventListener("click", closeQRScanner);
  }

  if (cancelScanner) {
    cancelScanner.addEventListener("click", closeQRScanner);
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
    return;
  }

  qrCode.innerHTML = "";

  /*
    IMPORTANT:
    Keep QR payload small.

    The previous JSON payload contained
    unnecessary fields and caused:

    code length overflow

    We only need the user ID.
    */

  const qrData = "OVC:" + currentUser.id;

  console.log("Generating QR:", qrData);

  if (typeof QRCode === "undefined") {
    console.error("QRCode library not loaded.");

    qrCode.innerHTML = `<div class="qr-error">
                ⚠️ QR generator unavailable
            </div>`;

    return;
  }

  try {
    new QRCode(
      qrCode,

      {
        text: qrData,

        width: 220,

        height: 220,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.M,
      },
    );
  } catch (error) {
    console.error("QR generation error:", error);

    qrCode.innerHTML = `<div class="qr-error">
                ⚠️ Unable to generate QR
            </div>`;
  }
}

/* =====================================================
   QR SCANNER
===================================================== */

function openQRScanner() {
  console.log("📷 Scan QR button clicked");

  if (typeof Html5Qrcode === "undefined") {
    showToast("⚠️", "QR scanner library not loaded.");

    return;
  }

  const scannerElement = document.getElementById("qr-reader");

  if (!scannerElement) {
    console.error("#qr-reader not found");

    showToast("❌", "QR scanner element not found.");

    return;
  }

  if (qrScanner) {
    return;
  }

  if (qrScannerPanel) {
    qrScannerPanel.style.display = "block";
  }

  qrScanner = new Html5Qrcode("qr-reader");

  qrScanner
    .start(
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

      function () {
        // QR not detected.
        // This is normal.
      },
    )

    .then(function () {
      console.log("📷 QR camera started.");
    })

    .catch(function (error) {
      console.error("QR camera error:", error);

      showToast("❌", "Could not open camera.");

      qrScanner = null;
    });
}

async function handleQRScan(decodedText) {
  console.log("📦 QR data:", decodedText);

  let userId = null;

  /*
    New compact format:
    OVC:user-id
    */

  if (decodedText.startsWith("OVC:")) {
    userId = decodedText.substring(4);
  } else {
    /*
        Backward compatibility
        with old JSON QR codes.
        */

    try {
      const oldData = JSON.parse(decodedText);

      if (oldData && oldData.type === "OVC_USER") {
        userId = oldData.id;
      }
    } catch (error) {
      console.error("Invalid QR:", error);
    }
  }

  if (!userId) {
    showToast("❌", "Invalid OVC QR code.");

    return;
  }

  if (currentUser && userId === currentUser.id) {
    showToast("😅", "That's your own QR code!");

    return;
  }

  console.log("🔎 Looking up OVC user:", userId);

  /*
    Ask signaling server
    for the user profile.

    This requires the server to
    implement "find-user".
    */

  if (!socket || !socket.connected) {
    showToast("⚠️", "Not connected to OVC network.");

    return;
  }

  socket.emit(
    "find-user",

    {
      userId: userId,
    },

    async function (userData) {
      if (!userData) {
        showToast("❌", "User is not currently online.");

        return;
      }

      await closeQRScanner();

      addPerson(userData);

      sendConnectionRequest(userData);
    },
  );
}

/* =====================================================
   STOP QR SCANNER
===================================================== */

async function stopQRScanner() {
  if (!qrScanner) {
    return;
  }

  try {
    await qrScanner.stop();

    qrScanner.clear();
  } catch (error) {
    console.error("QR stop error:", error);
  }

  qrScanner = null;
}

async function closeQRScanner() {
  await stopQRScanner();

  if (qrScannerPanel) {
    qrScannerPanel.style.display = "none";
  }
}

/* =====================================================
   QR SHARE
===================================================== */

async function shareUserQR() {
  if (!currentUser) {
    return;
  }

  const canvas = qrCode?.querySelector("canvas");

  if (!canvas) {
    showToast("⚠️", "QR code is not ready.");

    return;
  }

  try {
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

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
    } else {
      showToast("ℹ️", "Sharing is not supported.");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
    }
  }
}

/* =====================================================
   QR DOWNLOAD
===================================================== */

function downloadUserQR() {
  if (!currentUser) {
    return;
  }

  const canvas = qrCode?.querySelector("canvas");

  if (!canvas) {
    showToast("⚠️", "QR code is not ready.");

    return;
  }

  const link = document.createElement("a");

  link.download = `${currentUser.username}-OVC-QR.png`;

  link.href = canvas.toDataURL("image/png");

  link.click();
}

/* =====================================================
   PEOPLE SYSTEM
===================================================== */

function loadPeople() {
  try {
    const saved = localStorage.getItem(PEOPLE_STORAGE_KEY);

    if (saved) {
      people = JSON.parse(saved);
    }
  } catch (error) {
    people = [];
  }

  renderPeople();
}

function savePeople() {
  localStorage.setItem(
    PEOPLE_STORAGE_KEY,

    JSON.stringify(people),
  );
}

function addPerson(user) {
  if (!user || !user.id) {
    return;
  }

  if (currentUser && user.id === currentUser.id) {
    return;
  }

  const existing = people.find((person) => person.id === user.id);

  if (existing) {
    return;
  }

  people.push({
    id: user.id,

    username: user.username || "Unknown",

    avatar: user.avatar || "👤",

    status: "available",

    addedAt: Date.now(),
  });

  savePeople();

  renderPeople();
}

function renderPeople() {
  if (!peopleList) {
    return;
  }

  peopleList

    .querySelectorAll(".person-card")

    .forEach((card) => card.remove());

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
                    ${escapeHTML(person.avatar)}
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

    callButton.addEventListener(
      "click",

      function () {
        requestCall(person);
      },
    );
  });
}

/* =====================================================
   CONNECTION REQUEST
===================================================== */

function requestCall(user) {
  currentCallUser = user;

  if (connectionUserName) {
    connectionUserName.textContent = user.username;
  }

  if (connectionUserAvatar) {
    connectionUserAvatar.textContent = user.avatar || "👤";
  }

  if (connectionModal) {
    connectionModal.classList.remove("hidden");
  }
}

/* =====================================================
   SEND CONNECTION REQUEST
===================================================== */

function sendConnectionRequest(user) {
  if (!socket || !socket.connected) {
    showToast("⚠️", "Not connected to OVC network.");

    return;
  }

  if (!currentUser) {
    return;
  }

  socket.emit(
    "connection-request",

    {
      to: user.id,

      from: {
        id: currentUser.id,

        username: currentUser.username,

        avatar: currentUser.avatar,
      },
    },
  );

  showToast(
    "📡",

    `Request sent to ${user.username}`,
  );
}

/* =====================================================
   CONNECTION MODAL
===================================================== */

function setupConnectionButtons() {
  if (closeConnectionModal) {
    closeConnectionModal.addEventListener(
      "click",

      function () {
        closeConnectionModalHandler();
      },
    );
  }

  if (rejectConnection) {
    rejectConnection.addEventListener(
      "click",

      function () {
        rejectCurrentConnection();
      },
    );
  }

  if (acceptConnection) {
    acceptConnection.addEventListener(
      "click",

      function () {
        acceptCurrentConnection();
      },
    );
  }
}

function closeConnectionModalHandler() {
  if (connectionModal) {
    connectionModal.classList.add("hidden");
  }

  currentConnectionUser = null;
}

function rejectCurrentConnection() {
  if (pendingConnectionRequest && socket) {
    socket.emit(
      "connection-response",

      {
        to: pendingConnectionRequest.from.id,

        accepted: false,
      },
    );
  }

  closeConnectionModalHandler();
}

async function acceptCurrentConnection() {
  const user = pendingConnectionRequest || currentConnectionUser;

  if (!user) {
    closeConnectionModalHandler();

    return;
  }

  const remoteUser = user.from || user;

  addPerson(remoteUser);

  if (socket) {
    socket.emit(
      "connection-response",

      {
        to: remoteUser.id,

        accepted: true,

        user: {
          id: currentUser.id,

          username: currentUser.username,

          avatar: currentUser.avatar,
        },
      },
    );
  }

  closeConnectionModalHandler();

  showToast(
    "✅",

    `${remoteUser.username} connected!`,
  );
}

/* =====================================================
   SOCKET.IO
===================================================== */

function connectToSignalingServer() {
  if (!currentUser) {
    return;
  }

  if (socket && socket.connected) {
    return;
  }

  if (typeof io === "undefined") {
    console.error("Socket.IO library not loaded.");

    showToast("❌", "Socket.IO is unavailable.");

    return;
  }

  console.log("📡 Connecting to OVC signaling server...");

  socket = io(
    SIGNALING_SERVER,

    {
      transports: ["websocket", "polling"],
    },
  );

  socket.on(
    "connect",

    function () {
      isSocketConnected = true;

      console.log("🟢 Connected to OVC signaling server");

      socket.emit(
        "register-user",

        {
          id: currentUser.id,

          username: currentUser.username,

          avatar: currentUser.avatar,
        },
      );
    },
  );

  socket.on(
    "disconnect",

    function () {
      isSocketConnected = false;

      console.log("🔴 Disconnected from signaling server.");
    },
  );

  socket.on(
    "connect_error",

    function (error) {
      console.error("❌ Socket connection error:", error);
    },
  );

  /*
    =================================================
    INCOMING CONNECTION REQUEST
    =================================================
    */

  socket.on(
    "connection-request",

    function (data) {
      console.log("📩 Connection request:", data);

      pendingConnectionRequest = data;

      currentConnectionUser = data.from;

      if (connectionUserName) {
        connectionUserName.textContent = data.from.username;
      }

      if (connectionUserAvatar) {
        connectionUserAvatar.textContent = data.from.avatar || "👤";
      }

      if (connectionModal) {
        connectionModal.classList.remove("hidden");
      }

      showToast(
        "📩",

        `${data.from.username} wants to connect.`,
      );

      vibrate([300, 150, 300]);
    },
  );

  /*
    =================================================
    CONNECTION RESPONSE
    =================================================
    */

  socket.on(
    "connection-response",

    function (data) {
      console.log("📩 Connection response:", data);

      if (data.accepted) {
        if (data.user) {
          addPerson(data.user);
        }

        showToast(
          "✅",

          "Connection accepted!",
        );
      } else {
        showToast(
          "❌",

          "Connection request rejected.",
        );
      }
    },
  );

  /*
    =================================================
    WEBRTC OFFER
    =================================================
    */

  socket.on(
    "webrtc-offer",

    async function (data) {
      console.log("📡 WebRTC offer received.");

      currentCallUser = data.from;

      await prepareIncomingCall(data);
    },
  );

  /*
    =================================================
    WEBRTC ANSWER
    =================================================
    */

  socket.on(
    "webrtc-answer",

    async function (data) {
      console.log("📡 WebRTC answer received.");

      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      }
    },
  );

  /*
    =================================================
    ICE CANDIDATE
    =================================================
    */

  socket.on(
    "ice-candidate",

    async function (data) {
      if (peerConnection && data.candidate) {
        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (error) {
          console.error("ICE error:", error);
        }
      }
    },
  );
}

/* =====================================================
   VIDEO CALL
===================================================== */

async function startCall(user) {
  try {
    currentCallUser = user;

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

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    socket.emit(
      "webrtc-offer",

      {
        to: user.id,

        from: currentUser,

        offer: offer,
      },
    );

    if (callStatus) {
      callStatus.textContent = "Calling...";
    }
  } catch (error) {
    console.error("Call error:", error);

    showToast(
      "❌",

      "Unable to start call.",
    );
  }
}

/* =====================================================
   PREPARE INCOMING CALL
===================================================== */

async function prepareIncomingCall(data) {
  if (callerName) {
    callerName.textContent = data.from.username;
  }

  if (incomingCallModal) {
    incomingCallModal.classList.remove("hidden");
  }

  pendingConnectionRequest = data;
}

/* =====================================================
   ACCEPT INCOMING CALL
===================================================== */

async function acceptIncomingCall() {
  if (!pendingConnectionRequest) {
    return;
  }

  const data = pendingConnectionRequest;

  if (incomingCallModal) {
    incomingCallModal.classList.add("hidden");
  }

  currentCallUser = data.from;

  navigateTo("video-section");

  await startLocalMedia();

  createPeerConnection();

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer),
  );

  const answer = await peerConnection.createAnswer();

  await peerConnection.setLocalDescription(answer);

  socket.emit(
    "webrtc-answer",

    {
      to: data.from.id,

      from: currentUser,

      answer: answer,
    },
  );

  if (callStatus) {
    callStatus.textContent = "Connecting...";
  }
}

/* =====================================================
   INCOMING CALL BUTTONS
===================================================== */

if (acceptCall) {
  acceptCall.addEventListener(
    "click",

    async function () {
      await acceptIncomingCall();
    },
  );
}

if (rejectCall) {
  rejectCall.addEventListener(
    "click",

    function () {
      if (pendingConnectionRequest && socket) {
        socket.emit(
          "call-rejected",

          {
            to: pendingConnectionRequest.from.id,
          },
        );
      }

      if (incomingCallModal) {
        incomingCallModal.classList.add("hidden");
      }

      pendingConnectionRequest = null;
    },
  );
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
  if (peerConnection) {
    peerConnection.close();
  }

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
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });

    if (remotePlaceholder) {
      remotePlaceholder.classList.add("hidden");
    }
  };

  peerConnection.onicecandidate = function (event) {
    if (event.candidate && currentCallUser) {
      socket.emit(
        "ice-candidate",

        {
          to: currentCallUser.id,

          from: currentUser.id,

          candidate: event.candidate,
        },
      );
    }
  };

  peerConnection.onconnectionstatechange = function () {
    const state = peerConnection.connectionState;

    console.log("WebRTC state:", state);

    if (state === "connected") {
      if (callStatus) {
        callStatus.textContent = "Connected 🟢";
      }

      if (callGif) {
        callGif.src = gifs.success;
      }

      startCallTimer();
    }

    if (state === "disconnected" || state === "failed" || state === "closed") {
      if (callStatus) {
        callStatus.textContent = "Connection lost";
      }
    }
  };
}

/* =====================================================
   CALL CONTROLS
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

function toggleMute() {
  if (!localStream) {
    return;
  }

  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  isMuted = !isMuted;

  if (muteButton) {
    muteButton.textContent = isMuted ? "🔇" : "🎤";
  }

  vibrate([50]);
}

function toggleCamera() {
  if (!localStream) {
    return;
  }

  localStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  isCameraOff = !isCameraOff;

  if (cameraButton) {
    cameraButton.textContent = isCameraOff ? "📷" : "🎥";
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

  if (socket && currentCallUser) {
    socket.emit(
      "call-ended",

      {
        to: currentCallUser.id,
      },
    );
  }

  currentCallUser = null;

  showToast("👋", "Call ended.");

  setTimeout(
    function () {
      navigateTo("home-section");
    },

    1000,
  );
}

/* =====================================================
   CALL TIMER
===================================================== */

function startCallTimer() {
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
    videoSection.requestFullscreen().catch(console.error);
  } else {
    document.exitFullscreen();
  }
}

/* =====================================================
   SETTINGS
===================================================== */

function setupSettings() {
  if (vibrationToggle) {
    vibrationToggle.addEventListener(
      "change",

      function () {
        currentSettings.vibration = this.checked;

        saveSettings();
      },
    );
  }

  if (notificationToggle) {
    notificationToggle.addEventListener(
      "change",

      function () {
        currentSettings.notifications = this.checked;

        saveSettings();
      },
    );
  }

  if (gifToggle) {
    gifToggle.addEventListener(
      "change",

      function () {
        currentSettings.gifs = this.checked;

        saveSettings();
      },
    );
  }

  if (clearData) {
    clearData.addEventListener(
      "click",

      clearOVCData,
    );
  }

  if (editProfile) {
    editProfile.addEventListener(
      "click",

      editUserProfile,
    );
  }

  if (settingsProfile) {
    settingsProfile.addEventListener(
      "click",

      function () {
        navigateTo("profile-section");
      },
    );
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

  if (socket && socket.connected) {
    socket.emit(
      "register-user",

      {
        id: currentUser.id,

        username: currentUser.username,

        avatar: currentUser.avatar,
      },
    );
  }

  showToast("✅", "Profile updated.");
}

/* =====================================================
   CLEAR DATA
===================================================== */

function clearOVCData() {
  if (!confirm("Clear all OVC local data?")) {
    return;
  }

  if (socket) {
    socket.disconnect();
  }

  localStorage.removeItem(STORAGE_KEY);

  localStorage.removeItem(SETTINGS_KEY);

  localStorage.removeItem(PEOPLE_STORAGE_KEY);

  currentUser = null;

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

setInterval(
  updateBotMessage,

  5000,
);

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
   INSTALL PROMPT
===================================================== */

function setupInstallPrompt() {
  if (!installPrompt) {
    return;
  }

  installPrompt.classList.add("hidden");

  if (installButton) {
    installButton.addEventListener(
      "click",

      installOVC,
    );
  }

  if (closeInstall) {
    closeInstall.addEventListener(
      "click",

      function () {
        installPrompt.classList.add("hidden");
      },
    );
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

      showToast(
        "🎉",

        "OVC installed successfully!",
      );
    },
  );
}

async function installOVC() {
  if (!deferredInstallPrompt) {
    showToast(
      "ℹ️",

      "Installation is not available right now.",
    );

    return;
  }

  deferredInstallPrompt.prompt();

  await deferredInstallPrompt.userChoice;

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
            "Service Worker error:",

            error,
          );
        });
    },
  );
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

/* =====================================================
   END
===================================================== */

console.log("🚀 OVC client loaded.");
