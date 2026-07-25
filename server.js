const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Port
const PORT = process.env.PORT || 3000;

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },

    transports: ["websocket", "polling"]
});


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// =====================================================
// SERVE FRONTEND
// =====================================================

app.use(express.static(__dirname));


// =====================================================
// MAIN PAGE
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {

    res.status(200).json({

        status: "OK",

        app: "OVC Signaling Server",

        socketIO: true,

        message: "OVC signaling server is running"

    });

});


// =====================================================
// CONNECTED USERS
// =====================================================

const connectedUsers = new Map();


// =====================================================
// SOCKET CONNECTION
// =====================================================

io.on("connection", (socket) => {

    console.log(
        "🟢 Socket connected:",
        socket.id
    );


    // =================================================
    // REGISTER USER
    // =================================================

    socket.on("register-user", (user) => {

        if (
            !user ||
            !user.id ||
            !user.username
        ) {

            console.log(
                "❌ Invalid user registration"
            );

            return;

        }


        connectedUsers.set(
            user.id,
            {
                ...user,
                socketId: socket.id
            }
        );


        socket.userId =
            user.id;


        console.log(
            `👤 User registered: ${user.username} (${user.id})`
        );


        // Send current online users
        socket.emit(
            "online-users",
            Array.from(
                connectedUsers.values()
            )
        );


        // Notify everyone else
        socket.broadcast.emit(
            "user-online",
            user
        );

    });


    // =================================================
    // CONNECTION REQUEST
    // =================================================

    socket.on(
        "connection-request",
        (data) => {

            if (
                !data ||
                !data.from ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to.id
                );


            if (!targetUser) {

                socket.emit(
                    "user-offline",
                    {
                        userId:
                            data.to.id
                    }
                );

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "connection-request",
                {
                    from:
                        data.from
                }
            );


            console.log(
                `📨 Connection request: ${data.from.username} → ${data.to.username}`
            );

        }
    );


    // =================================================
    // CONNECTION RESPONSE
    // =================================================

    socket.on(
        "connection-response",
        (data) => {

            if (
                !data ||
                !data.to ||
                !data.accepted
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to.id
                );


            if (!targetUser) {

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "connection-response",
                {
                    from:
                        data.from,

                    accepted:
                        data.accepted
                }
            );

        }
    );


    // =================================================
    // WEBRTC OFFER
    // =================================================

    socket.on(
        "webrtc-offer",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                console.log(
                    "❌ Target user for offer not found"
                );

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "webrtc-offer",
                {
                    from:
                        data.from,

                    offer:
                        data.offer
                }
            );


            console.log(
                "📡 WebRTC offer forwarded"
            );

        }
    );


    // =================================================
    // WEBRTC ANSWER
    // =================================================

    socket.on(
        "webrtc-answer",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "webrtc-answer",
                {
                    from:
                        data.from,

                    answer:
                        data.answer
                }
            );


            console.log(
                "📡 WebRTC answer forwarded"
            );

        }
    );


    // =================================================
    // ICE CANDIDATE
    // =================================================

    socket.on(
        "webrtc-ice-candidate",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "webrtc-ice-candidate",
                {
                    from:
                        data.from,

                    candidate:
                        data.candidate
                }
            );

        }
    );


    // =================================================
    // CALL REQUEST
    // =================================================

    socket.on(
        "call-request",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                socket.emit(
                    "user-offline",
                    {
                        userId:
                            data.to
                    }
                );

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "incoming-call",
                {
                    from:
                        data.from
                }
            );


            console.log(
                "📞 Incoming call forwarded"
            );

        }
    );


    // =================================================
    // CALL ACCEPTED
    // =================================================

    socket.on(
        "call-accepted",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "call-accepted",
                {
                    from:
                        data.from
                }
            );

        }
    );


    // =================================================
    // CALL REJECTED
    // =================================================

    socket.on(
        "call-rejected",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "call-rejected",
                {
                    from:
                        data.from
                }
            );

        }
    );


    // =================================================
    // END CALL
    // =================================================

    socket.on(
        "end-call",
        (data) => {

            if (
                !data ||
                !data.to
            ) {

                return;

            }


            const targetUser =
                connectedUsers.get(
                    data.to
                );


            if (!targetUser) {

                return;

            }


            io.to(
                targetUser.socketId
            ).emit(
                "call-ended",
                {
                    from:
                        data.from
                }
            );

        }
    );


    // =================================================
    // DISCONNECT
    // =================================================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "🔴 Socket disconnected:",
                socket.id
            );


            if (
                socket.userId
            ) {

                const user =
                    connectedUsers.get(
                        socket.userId
                    );


                connectedUsers.delete(
                    socket.userId
                );


                if (user) {

                    io.emit(
                        "user-offline",
                        {
                            userId:
                                user.id
                        }
                    );

                }

            }

        }
    );

});


// =====================================================
// START SERVER
// =====================================================

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🚀 OVC signaling server running on port ${PORT}`
        );

        console.log(
            `📡 Socket.IO signaling enabled`
        );

    }
);