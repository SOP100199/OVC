/* =====================================================
   OVC SIGNALING SERVER
   Express + Socket.IO
===================================================== */

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

/* =====================================================
   CONFIGURATION
===================================================== */

const PORT = process.env.PORT || 3000;


/* =====================================================
   EXPRESS SERVER
===================================================== */

const server = http.createServer(app);


/* =====================================================
   SOCKET.IO
===================================================== */

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: [
            "GET",
            "POST"
        ]

    }

});


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =====================================================
   SERVE OVC FRONTEND
===================================================== */

app.use(
    express.static(__dirname)
);


/* =====================================================
   MAIN PAGE
===================================================== */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            status: "OK",

            app: "OVC",

            service:
                "OVC Signaling Server",

            message:
                "OVC signaling server is running",

            onlineUsers:
                onlineUsers.size

        });

    }
);


/* =====================================================
   ONLINE USERS
===================================================== */

/*
    Map:

    OVC User ID
        ↓
    Socket ID

    Example:

    ovc-123
        ↓
    socket-abc

*/

const onlineUsers =
    new Map();


/*
    Reverse map:

    Socket ID
        ↓
    OVC User ID

*/

const socketUsers =
    new Map();


/* =====================================================
   SOCKET CONNECTION
===================================================== */

io.on(
    "connection",
    (socket) => {

        console.log(
            "🟢 User connected:",
            socket.id
        );


        /* =================================================
           REGISTER USER
        ================================================= */

        socket.on(
            "register-user",
            (user) => {

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


                /*
                    Remove previous socket
                    if user reconnects.
                */

                const oldSocketId =
                    onlineUsers.get(
                        user.id
                    );


                if (oldSocketId) {

                    socketUsers.delete(
                        oldSocketId
                    );

                }


                /*
                    Save new connection
                */

                onlineUsers.set(
                    user.id,
                    socket.id
                );


                socketUsers.set(
                    socket.id,
                    user.id
                );


                /*
                    Store user data
                    inside socket
                */

                socket.user = {

                    id:
                        user.id,

                    username:
                        user.username,

                    avatar:
                        user.avatar || "👤"

                };


                console.log(
                    `🟢 Registered: ${user.username}`
                );


                console.log(
                    `   User ID: ${user.id}`
                );


                console.log(
                    `   Socket ID: ${socket.id}`
                );


                /*
                    Tell user registration succeeded
                */

                socket.emit(
                    "registration-success",
                    {

                        userId:
                            user.id,

                        socketId:
                            socket.id

                    }
                );


                /*
                    Send online user list
                */

                sendOnlineUsers();

            }
        );


        /* =================================================
           GET ONLINE USERS
        ================================================= */

        socket.on(
            "get-online-users",
            () => {

                sendOnlineUsers();

            }
        );


        /* =================================================
           CONNECTION REQUEST
        ================================================= */

        socket.on(
            "connection-request",
            (data) => {

                if (
                    !data ||
                    !data.targetUserId
                ) {

                    return;

                }


                const targetSocketId =
                    onlineUsers.get(
                        data.targetUserId
                    );


                /*
                    Target user is offline
                */

                if (
                    !targetSocketId
                ) {

                    socket.emit(
                        "connection-request-failed",
                        {

                            targetUserId:
                                data.targetUserId,

                            reason:
                                "User is offline"

                        }
                    );

                    return;

                }


                console.log(
                    `📨 Connection request: ${socket.user?.username} → ${data.targetUserId}`
                );


                /*
                    Send request to target
                */

                io.to(
                    targetSocketId
                ).emit(
                    "incoming-connection-request",
                    {

                        fromUser: {

                            id:
                                socket.user?.id,

                            username:
                                socket.user?.username,

                            avatar:
                                socket.user?.avatar

                        },

                        requestId:
                            `${socket.id}-${Date.now()}`

                    }
                );

            }
        );


        /* =================================================
           CONNECTION RESPONSE
        ================================================= */

        socket.on(
            "connection-response",
            (data) => {

                if (
                    !data ||
                    !data.targetUserId
                ) {

                    return;

                }


                const targetSocketId =
                    onlineUsers.get(
                        data.targetUserId
                    );


                if (
                    !targetSocketId
                ) {

                    return;

                }


                console.log(
                    `📨 Connection response from ${socket.user?.username}: ${data.accepted}`
                );


                io.to(
                    targetSocketId
                ).emit(
                    "connection-response",
                    {

                        accepted:
                            data.accepted,

                        fromUser: {

                            id:
                                socket.user?.id,

                            username:
                                socket.user?.username,

                            avatar:
                                socket.user?.avatar

                        }

                    }
                );

            }
        );


        /* =================================================
           WEBRTC OFFER
        ================================================= */

        socket.on(
            "webrtc-offer",
            (data) => {

                if (
                    !data ||
                    !data.targetUserId ||
                    !data.offer
                ) {

                    return;

                }


                const targetSocketId =
                    onlineUsers.get(
                        data.targetUserId
                    );


                if (
                    !targetSocketId
                ) {

                    return;

                }


                console.log(
                    `📹 WebRTC Offer: ${socket.user?.username}`
                );


                io.to(
                    targetSocketId
                ).emit(
                    "webrtc-offer",
                    {

                        offer:
                            data.offer,

                        fromUser: {

                            id:
                                socket.user?.id,

                            username:
                                socket.user?.username,

                            avatar:
                                socket.user?.avatar

                        }

                    }
                );

            }
        );


        /* =================================================
           WEBRTC ANSWER
        ================================================= */

        socket.on(
            "webrtc-answer",
            (data) => {

                if (
                    !data ||
                    !data.targetUserId ||
                    !data.answer
                ) {

                    return;

                }


                const targetSocketId =
                    onlineUsers.get(
                        data.targetUserId
                    );


                if (
                    !targetSocketId
                ) {

                    return;

                }


                console.log(
                    `📹 WebRTC Answer: ${socket.user?.username}`
                );


                io.to(
                    targetSocketId
                ).emit(
                    "webrtc-answer",
                    {

                        answer:
                            data.answer,

                        fromUser: {

                            id:
                                socket.user?.id,

                            username:
                                socket.user?.username,

                            avatar:
                                socket.user?.avatar

                        }

                    }
                );

            }
        );


        /* =================================================
           ICE CANDIDATE
        ================================================= */

        socket.on(
            "ice-candidate",
            (data) => {

                if (
                    !data ||
                    !data.targetUserId ||
                    !data.candidate
                ) {

                    return;

                }


                const targetSocketId =
                    onlineUsers.get(
                        data.targetUserId
                    );


                if (
                    !targetSocketId
                ) {

                    return;

                }


                io.to(
                    targetSocketId
                ).emit(
                    "ice-candidate",
                    {

                        candidate:
                            data.candidate,

                        fromUser: {

                            id:
                                socket.user?.id,

                            username:
                                socket.user?.username

                        }

                    }
                );

            }
        );


        /* =================================================
           END CALL
        ================================================= */

        socket.on(
            "end-call",
            (data) => {

                if (
                    !data ||
                    !data.targetUserId
                ) {

                    return;

                }


                const targetSocketId =
                    onlineUsers.get(
                        data.targetUserId
                    );


                if (
                    !targetSocketId
                ) {

                    return;

                }


                io.to(
                    targetSocketId
                ).emit(
                    "call-ended",
                    {

                        fromUser: {

                            id:
                                socket.user?.id,

                            username:
                                socket.user?.username

                        }

                    }
                );

            }
        );


        /* =================================================
           DISCONNECT
        ================================================= */

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "🔴 User disconnected:",
                    socket.id
                );


                const userId =
                    socketUsers.get(
                        socket.id
                    );


                if (
                    userId
                ) {

                    /*
                        Only delete if this is
                        still the active socket.
                    */

                    if (
                        onlineUsers.get(
                            userId
                        ) ===
                        socket.id
                    ) {

                        onlineUsers.delete(
                            userId
                        );

                    }


                    socketUsers.delete(
                        socket.id
                    );


                    console.log(
                        `🔴 User offline: ${userId}`
                    );


                    /*
                        Update everyone
                    */

                    sendOnlineUsers();

                }

            }
        );

    }
);


/* =====================================================
   SEND ONLINE USERS
===================================================== */

function sendOnlineUsers() {

    const users = [];


    onlineUsers.forEach(
        (socketId, userId) => {

            const connectedSocket =
                io.sockets.sockets.get(
                    socketId
                );


            if (
                connectedSocket &&
                connectedSocket.user
            ) {

                users.push({

                    id:
                        connectedSocket.user.id,

                    username:
                        connectedSocket.user.username,

                    avatar:
                        connectedSocket.user.avatar

                });

            }

        }
    );


    io.emit(
        "online-users",
        users
    );

}


/* =====================================================
   START SERVER
===================================================== */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================="
        );

        console.log(
            "🚀 OVC Signaling Server Started"
        );

        console.log(
            `🌐 Port: ${PORT}`
        );

        console.log(
            "📡 Socket.IO: Enabled"
        );

        console.log(
            "🎥 WebRTC Signaling: Enabled"
        );

        console.log(
            "================================="

        );

    }
);