const express = require("express");
const http = require("http");
const path = require("path");
const os = require("os");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

/* =====================================================
   EXPRESS
===================================================== */

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname));


/* =====================================================
   MAIN PAGE
===================================================== */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


/* =====================================================
   HEALTH
===================================================== */

app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        app: "OVC",
        mode: "OFFLINE_FIRST"
    });

});


/* =====================================================
   CONNECTED USERS
===================================================== */

const users = new Map();


/* =====================================================
   SOCKET.IO
===================================================== */

io.on("connection", (socket) => {

    console.log(
        "Client connected:",
        socket.id
    );


    /* ================================================
       REGISTER USER
    ================================================ */

    socket.on(
        "register-user",
        (user) => {

            if (
                !user ||
                !user.id ||
                !user.username
            ) {

                return;

            }


            users.set(
                socket.id,
                {
                    socketId: socket.id,
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar || "👤"
                }
            );


            console.log(
                "User registered:",
                user.username,
                socket.id
            );


            /* Send current online users */

            broadcastUsers();

        }
    );


    /* ================================================
       REQUEST CONNECTION
    ================================================ */

    socket.on(
        "connection-request",
        (data) => {

            if (
                !data ||
                !data.targetSocketId
            ) {

                return;

            }


            const sender =
                users.get(
                    socket.id
                );


            if (!sender) {

                return;

            }


            io.to(
                data.targetSocketId
            ).emit(
                "incoming-connection-request",
                {
                    from: sender,
                    socketId: socket.id
                }
            );

        }
    );


    /* ================================================
       CONNECTION RESPONSE
    ================================================ */

    socket.on(
        "connection-response",
        (data) => {

            if (
                !data ||
                !data.targetSocketId
            ) {

                return;

            }


            io.to(
                data.targetSocketId
            ).emit(
                "connection-response",
                {
                    accepted:
                        data.accepted,

                    from:
                        users.get(
                            socket.id
                        )
                }
            );

        }
    );


    /* ================================================
       WEBRTC OFFER
    ================================================ */

    socket.on(
        "webrtc-offer",
        (data) => {

            if (
                !data ||
                !data.targetSocketId
            ) {

                return;

            }


            io.to(
                data.targetSocketId
            ).emit(
                "webrtc-offer",
                {
                    offer:
                        data.offer,

                    fromSocketId:
                        socket.id
                }
            );

        }
    );


    /* ================================================
       WEBRTC ANSWER
    ================================================ */

    socket.on(
        "webrtc-answer",
        (data) => {

            if (
                !data ||
                !data.targetSocketId
            ) {

                return;

            }


            io.to(
                data.targetSocketId
            ).emit(
                "webrtc-answer",
                {
                    answer:
                        data.answer,

                    fromSocketId:
                        socket.id
                }
            );

        }
    );


    /* ================================================
       ICE CANDIDATE
    ================================================ */

    socket.on(
        "webrtc-ice-candidate",
        (data) => {

            if (
                !data ||
                !data.targetSocketId
            ) {

                return;

            }


            io.to(
                data.targetSocketId
            ).emit(
                "webrtc-ice-candidate",
                {
                    candidate:
                        data.candidate,

                    fromSocketId:
                        socket.id
                }
            );

        }
    );


    /* ================================================
       END CALL
    ================================================ */

    socket.on(
        "end-call",
        (data) => {

            if (
                !data ||
                !data.targetSocketId
            ) {

                return;

            }


            io.to(
                data.targetSocketId
            ).emit(
                "remote-call-ended"
            );

        }
    );


    /* ================================================
       DISCONNECT
    ================================================ */

    socket.on(
        "disconnect",
        () => {

            const user =
                users.get(
                    socket.id
                );


            if (user) {

                console.log(
                    "User disconnected:",
                    user.username
                );

            }


            users.delete(
                socket.id
            );


            broadcastUsers();

        }
    );

});


/* =====================================================
   BROADCAST ONLINE USERS
===================================================== */

function broadcastUsers() {

    const userList =
        Array.from(
            users.values()
        );


    io.emit(
        "online-users",
        userList
    );

}


/* =====================================================
   GET LOCAL IP
===================================================== */

function getLocalIP() {

    const interfaces =
        os.networkInterfaces();


    for (
        const name of Object.keys(interfaces)
    ) {

        for (
            const network of interfaces[name]
        ) {

            if (
                network.family === "IPv4" &&
                !network.internal
            ) {

                return network.address;

            }

        }

    }


    return "localhost";

}


/* =====================================================
   START SERVER
===================================================== */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        const ip =
            getLocalIP();


        console.log("");
        console.log(
            "===================================="
        );

        console.log(
            "       OVC OFFLINE SERVER"
        );

        console.log(
            "===================================="
        );

        console.log(
            `Local: http://localhost:${PORT}`
        );

        console.log(
            `LAN:   http://${ip}:${PORT}`
        );

        console.log(
            "===================================="
        );

        console.log(
            "Connect devices to the same Wi-Fi"
        );

        console.log(
            "Then open the LAN URL above."
        );

        console.log(
            "===================================="
        );

    }
);