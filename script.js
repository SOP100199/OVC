/* =========================================================
   OVC v0.1
   Offline Video Calling
   Complete JavaScript
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const nameInput = document.getElementById("username");
const genderInput = document.getElementById("gender");
const sendButton = document.getElementById("send");

const loginSection =
    document.querySelector(".login");

const videoLayout =
    document.getElementById("video-layout");

const videoLayoutGrid =
    document.querySelector(
        ".videolayoutgrid"
    );

const profileButton =
    document.querySelector(
        ".nav-profile"
    );


/* =========================================================
   OVC PROFILE EMOJIS
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
   OVC GIF COLLECTION
========================================================= */

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


/* =========================================================
   OVC BOT MESSAGES
========================================================= */

const messages = [

    "Hey! 👋",

    "Welcome to OVC! 😎",

    "I'm your OVC guide 🤖",

    "We communicate without the Internet! 📡",

    "No Wi-Fi? No problem! 😂",

    "The Internet can take a break. OVC won't. 😎",

    "First, tell me your name! 👀",

    "Don't worry, I won't judge your username. 😂",

    "Ready to meet people nearby? 👋",

    "Let's get you connected! 🚀",

    "OVC is waking up... ☕",

    "Searching for absolutely nothing... just kidding! 😂",

    "Your local network is your new Internet. 🌐",

    "Welcome aboard! 🚀"

];


/* =========================================================
   OVC USER DATA
========================================================= */

let currentUser = null;


/* =========================================================
   PWA INSTALL
========================================================= */

let deferredInstallPrompt = null;


/* =========================================================
   HELPER
========================================================= */

function getRandomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================================================
   GET RANDOM USER AVATAR
========================================================= */

function getUserAvatar(gender) {

    if (
        gender === "female"
    ) {

        return getRandomItem(
            user_profile_girl_images
        );

    }


    return getRandomItem(
        user_profile_boy_images
    );

}


/* =========================================================
   CREATE BOT MESSAGE
========================================================= */

function createBotMessage() {

    const oldMessage =
        document.querySelector(
            ".bot-message"
        );


    if (
        !oldMessage
    ) {

        return;

    }


    oldMessage.textContent =
        getRandomItem(
            messages
        );

}


/* =========================================================
   CREATE LOGIN GIF
========================================================= */

function createLoginGif() {

    if (
        document.querySelector(
            ".login-gif-container"
        )
    ) {

        return;

    }


    if (
        !loginSection
    ) {

        return;

    }


    const loginMain =
        loginSection.querySelector(
            ".login-main"
        );


    if (
        !loginMain
    ) {

        return;

    }


    const container =
        document.createElement(
            "div"
        );


    container.className =
        "login-gif-container";


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "status-gif";


    image.alt =
        "OVC Status";


    image.src =
        getRandomItem(
            gifs
        );


    container.appendChild(
        image
    );


    loginMain.insertBefore(
        container,
        loginMain.firstChild
    );


    setTimeout(
        () => {

            image.classList.add(
                "show"
            );

        },
        100
    );

}


/* =========================================================
   SHOW GIF
========================================================= */

function showRandomGif() {

    const existingGif =
        document.querySelector(
            ".login-gif-container img"
        );


    if (
        !existingGif
    ) {

        return;

    }


    existingGif.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            existingGif.src =
                getRandomItem(
                    gifs
                );


            existingGif.classList.add(
                "show"
            );

        },
        500
    );

}


/* =========================================================
   SHOW STATUS MESSAGE
========================================================= */

function showStatusMessage(
    message
) {

    let statusMessage =
        document.querySelector(
            ".status-message"
        );


    if (
        !statusMessage
    ) {

        statusMessage =
            document.createElement(
                "div"
            );


        statusMessage.className =
            "status-message";


        document.body.appendChild(
            statusMessage
        );

    }


    statusMessage.textContent =
        message;


    statusMessage.classList.add(
        "show"
    );


    setTimeout(
        () => {

            statusMessage.classList.remove(
                "show"
            );

        },
        3500
    );

}


/* =========================================================
   SHOW TOAST
========================================================= */

function showToast(
    message
) {

    let toast =
        document.querySelector(
            ".toast"
        );


    if (
        !toast
    ) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "toast";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
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
   SAVE USER
========================================================= */

function saveUser(
    user
) {

    localStorage.setItem(
        "ovc_user",
        JSON.stringify(
            user
        )
    );

}


/* =========================================================
   LOAD USER
========================================================= */

function loadUser() {

    const savedUser =
        localStorage.getItem(
            "ovc_user"
        );


    if (
        !savedUser
    ) {

        return null;

    }


    try {

        return JSON.parse(
            savedUser
        );

    }

    catch (
        error
    ) {

        console.error(
            "OVC: Failed to load user",
            error
        );


        localStorage.removeItem(
            "ovc_user"
        );


        return null;

    }

}


/* =========================================================
   UPDATE PROFILE
========================================================= */

function updateProfile(
    user
) {

    if (
        !profileButton
    ) {

        return;

    }


    profileButton.textContent =
        user.avatar;


    profileButton.title =
        user.name;

}


/* =========================================================
   CREATE OVC MAIN SCREEN
========================================================= */

function createMainScreen(
    user
) {

    if (
        !videoLayout
    ) {

        return;

    }


    videoLayout.style.display =
        "block";


    if (
        videoLayoutGrid
    ) {

        videoLayoutGrid.innerHTML = `

            <div class="ovc-welcome">

                <div class="welcome-avatar">
                    ${user.avatar}
                </div>

                <h2>
                    Hey ${user.name}! 👋
                </h2>

                <p>
                    Welcome to OVC.
                </p>

                <p>
                    Your offline video calling
                    experience starts here. 📡
                </p>

                <div class="ovc-status">

                    <span>
                        🟢
                    </span>

                    OVC is ready

                </div>

            </div>

        `;

    }

}


/* =========================================================
   LOGIN USER
========================================================= */

function loginUser() {

    if (
        !nameInput
    ) {

        return;

    }


    const username =
        nameInput.value.trim();


    const gender =
        genderInput
            ? genderInput.value
            : "male";


    if (
        username.length === 0
    ) {

        showStatusMessage(
            "Hey! You forgot to tell me your name. 😂"
        );


        nameInput.focus();


        return;

    }


    if (
        username.length > 30
    ) {

        showStatusMessage(
            "Whoa! That's a long name. Keep it under 30 characters! 😅"
        );


        return;

    }


    const user = {

        name:
            username,

        gender:
            gender,

        avatar:
            getUserAvatar(
                gender
            ),

        createdAt:
            Date.now()

    };


    currentUser =
        user;


    saveUser(
        user
    );


    updateProfile(
        user
    );


    if (
        loginSection
    ) {

        loginSection.style.display =
            "none";

    }


    createMainScreen(
        user
    );


    showRandomGif();


    showStatusMessage(
        `Welcome ${user.name}! 🚀`
    );


    console.log(
        "OVC User:",
        user
    );

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

if (
    sendButton
) {

    sendButton.addEventListener(
        "click",
        loginUser
    );

}


/* =========================================================
   ENTER KEY LOGIN
========================================================= */

if (
    nameInput
) {

    nameInput.addEventListener(
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

}


/* =========================================================
   PROFILE BUTTON
========================================================= */

if (
    profileButton
) {

    profileButton.addEventListener(
        "click",
        () => {

            if (
                !currentUser
            ) {

                return;

            }


            const confirmLogout =
                confirm(
                    `Logged in as ${currentUser.name} ${currentUser.avatar}\n\nDo you want to reset your OVC profile?`
                );


            if (
                confirmLogout
            ) {

                localStorage.removeItem(
                    "ovc_user"
                );


                location.reload();

            }

        }
    );

}


/* =========================================================
   RESTORE USER
========================================================= */

function restoreUser() {

    const savedUser =
        loadUser();


    if (
        !savedUser
    ) {

        createLoginGif();


        createBotMessage();


        return;

    }


    currentUser =
        savedUser;


    if (
        nameInput
    ) {

        nameInput.value =
            savedUser.name;

    }


    if (
        genderInput
    ) {

        genderInput.value =
            savedUser.gender;

    }


    updateProfile(
        savedUser
    );


    if (
        loginSection
    ) {

        loginSection.style.display =
            "none";

    }


    createMainScreen(
        savedUser
    );

}


/* =========================================================
   CHANGE BOT MESSAGE
========================================================= */

setInterval(
    () => {

        if (
            !currentUser
        ) {

            createBotMessage();

        }

    },
    5000
);


/* =========================================================
   CHANGE LOGIN GIF
========================================================= */

setInterval(
    () => {

        if (
            !currentUser
        ) {

            showRandomGif();

        }

    },
    8000
);


/* =========================================================
   PWA INSTALL PROMPT
========================================================= */

window.addEventListener(
    "beforeinstallprompt",
    (event) => {

        console.log(
            "OVC can be installed"
        );


        // Prevent Chrome's automatic banner
        event.preventDefault();


        // Save install event
        deferredInstallPrompt =
            event;


        // Don't show if already installed
        if (
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches
        ) {

            return;

        }


        // Check if user dismissed prompt
        const dismissed =
            sessionStorage.getItem(
                "ovc_install_dismissed"
            );


        if (
            dismissed === "true"
        ) {

            return;

        }


        // Find custom install prompt
        const installPrompt =
            document.querySelector(
                ".install-prompt"
            );


        if (
            installPrompt
        ) {

            setTimeout(
                () => {

                    installPrompt.classList.add(
                        "show"
                    );

                },
                2500
            );

        }

    }
);


/* =========================================================
   INSTALL BUTTON
========================================================= */

const installButton =
    document.querySelector(
        "#install-button, .install-button"
    );


if (
    installButton
) {

    installButton.addEventListener(
        "click",
        async () => {

            if (
                !deferredInstallPrompt
            ) {

                showToast(
                    "OVC installation is not available right now."
                );


                return;

            }


            // Show native browser install dialog
            deferredInstallPrompt.prompt();


            try {

                const result =
                    await deferredInstallPrompt.userChoice;


                console.log(
                    "OVC installation result:",
                    result.outcome
                );


                if (
                    result.outcome ===
                    "accepted"
                ) {

                    showToast(
                        "🎉 OVC is being installed!"
                    );

                }

                else {

                    showToast(
                        "Installation cancelled."
                    );

                }

            }

            catch (
                error
            ) {

                console.error(
                    "OVC installation error:",
                    error
                );

            }


            // Prompt can only be used once
            deferredInstallPrompt =
                null;


            const installPrompt =
                document.querySelector(
                    ".install-prompt"
                );


            if (
                installPrompt
            ) {

                installPrompt.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE INSTALL PROMPT
========================================================= */

const closeInstall =
    document.querySelector(
        "#close-install, .close-install"
    );


if (
    closeInstall
) {

    closeInstall.addEventListener(
        "click",
        () => {

            const installPrompt =
                document.querySelector(
                    ".install-prompt"
                );


            if (
                installPrompt
            ) {

                installPrompt.classList.remove(
                    "show"
                );

            }


            sessionStorage.setItem(
                "ovc_install_dismissed",
                "true"
            );

        }
    );

}


/* =========================================================
   APP INSTALLED
========================================================= */

window.addEventListener(
    "appinstalled",
    () => {

        console.log(
            "🎉 OVC installed successfully!"
        );


        deferredInstallPrompt =
            null;


        const installPrompt =
            document.querySelector(
                ".install-prompt"
            );


        if (
            installPrompt
        ) {

            installPrompt.classList.remove(
                "show"
            );

        }


        showToast(
            "🎉 Welcome to OVC!"
        );

    }
);


/* =========================================================
   SERVICE WORKER REGISTRATION
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
                    "./sw.js"
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


/* =========================================================
   INITIALIZE OVC
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🚀 OVC v0.1 starting..."
        );


        restoreUser();


        console.log(
            "OVC v0.1 ready."
        );

    }
);