/*
=====================================================
 OVC - OFFLINE VIDEO CALLING
 SIGNALING SERVER
 VERSION 1.0.0
=====================================================

IMPORTANT:

This server DOES NOT carry video or audio.

It only handles:

1. User registration
2. Online presence
3. Connection requests
4. Connection acceptance
5. Connection rejection
6. WebRTC signaling
7. Call requests
8. Call acceptance
9. Call rejection
10. Call ending

Actual video/audio:
        User A
           ↕
       WebRTC P2P
           ↕
        User B

=====================================================
*/

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");


/* =====================================================
   APP CONFIGURATION
===================================================== */

const PORT =
    process.env.PORT || 3000;


/* =====================================================
   EXPRESS
===================================================== */

const app =
    express();


app.use(
    cors({
        origin: "*"
    })
);


app.use(
    express.json()
);


/* =====================================================
   HTTP SERVER
===================================================== */

const server =
    http.createServer(
        app
    );


/* =====================================================
   SOCKET.IO
===================================================== */

const io =
    new Server(
        server,
        {
            cors: {
                origin: "*",
                methods: [
                    "GET",
                    "POST"
                ]
            }
        }
    );


/* =====================================================
   ONLINE USERS
===================================================== */

/*
    userId => {
        socketId,
        id,
        username,
        avatar,
        gender
    }
*/

const onlineUsers =
    new Map();


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function getUserById(
    userId
) {

    return onlineUsers.get(
        userId
    );

}


function getUserSocket(
    userId
) {

    const user =
        getUserById(
            userId
        );


    if (!user) {
        return null;
    }


    return io.sockets.sockets.get(
        user.socketId
    );

}


function sendToUser(
    userId,
    event,
    data
) {

    const user =
        getUserById(
            userId
        );


    if (!user) {

        console.log(
            `User ${userId} is offline`
        );

        return false;

    }


    io.to(
        user.socketId
    ).emit(
        event,
        data
    );


    return true;

}


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            service:
                "OVC Signaling Server",

            version:
                "1.0.0",

            onlineUsers:
                onlineUsers.size,

            status:
                "running"

        });

    }
);


/* =====================================================
   SERVER STATUS
===================================================== */

app.get(
    "/status",
    (req, res) => {

        res.json({

            online:
                onlineUsers.size,

            users:
                Array.from(
                    onlineUsers.values()
                ).map(
                    user => ({

                        id:
                            user.id,

                        username:
                            user.username,

                        avatar:
                            user.avatar

                    })
                )

        });

    }
);


/* =====================================================
   SOCKET CONNECTION
===================================================== */

io.on(
    "connection",
    socket => {

        console.log(
            "🔌 New socket connection:",
            socket.id
        );


        /* =================================================
           USER REGISTER
        ================================================= */

        socket.on(
            "user:register",
            user => {

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
                    Remove old socket
                    if user reconnects.
                */

                const existingUser =
                    onlineUsers.get(
                        user.id
                    );


                if (
                    existingUser &&
                    existingUser.socketId !==
                    socket.id
                ) {

                    const oldSocket =
                        io.sockets.sockets.get(
                            existingUser.socketId
                        );


                    if (oldSocket) {

                        oldSocket.disconnect(
                            true
                        );

                    }

                }


                /* Store user */

                onlineUsers.set(
                    user.id,
                    {

                        id:
                            user.id,

                        username:
                            user.username,

                        avatar:
                            user.avatar ||
                            "👤",

                        gender:
                            user.gender ||
                            "unknown",

                        socketId:
                            socket.id

                    }
                );


                /*
                    Store user ID
                    on socket itself.
                */

                socket.ovcUserId =
                    user.id;


                console.log(
                    `🟢 ${user.username} is online`
                );


                /* Join personal room */

                socket.join(
                    `user:${user.id}`
                );


                /* Confirm registration */

                socket.emit(
                    "user:registered",
                    {

                        success:
                            true,

                        userId:
                            user.id

                    }
                );


                /* Notify everyone */

                io.emit(
                    "user:online",
                    {

                        id:
                            user.id,

                        username:
                            user.username,

                        avatar:
                            user.avatar ||
                            "👤"

                    }
                );


                /*
                    Send current online users
                    to newly connected user.
                */

                const users =
                    Array.from(
                        onlineUsers.values()
                    )
                    .filter(
                        onlineUser =>
                            onlineUser.id !==
                            user.id
                    )
                    .map(
                        onlineUser => ({

                            id:
                                onlineUser.id,

                            username:
                                onlineUser.username,

                            avatar:
                                onlineUser.avatar

                        })
                    );


                socket.emit(
                    "users:online",
                    users
                );

            }
        );


        /* =================================================
           CONNECTION REQUEST
        ================================================= */

        socket.on(
            "connection:request",
            data => {

                console.log(
                    "📨 Connection request:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                const sender =
                    getUserById(
                        data.from
                    );


                if (!sender) {

                    return;

                }


                const delivered =
                    sendToUser(

                        data.to,

                        "connection:request",

                        {

                            from: {

                                id:
                                    sender.id,

                                username:
                                    sender.username,

                                avatar:
                                    sender.avatar

                            }

                        }

                    );


                socket.emit(
                    "connection:request:sent",
                    {

                        success:
                            delivered,

                        to:
                            data.to

                    }
                );

            }
        );


        /* =================================================
           CONNECTION ACCEPT
        ================================================= */

        socket.on(
            "connection:accept",
            data => {

                console.log(
                    "✅ Connection accepted:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                const accepter =
                    getUserById(
                        data.from
                    );


                if (!accepter) {
                    return;
                }


                sendToUser(

                    data.to,

                    "connection:accepted",

                    {

                        user: {

                            id:
                                accepter.id,

                            username:
                                accepter.username,

                            avatar:
                                accepter.avatar

                        }

                    }

                );

            }
        );


        /* =================================================
           CONNECTION REJECT
        ================================================= */

        socket.on(
            "connection:reject",
            data => {

                console.log(
                    "❌ Connection rejected:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                const rejecter =
                    getUserById(
                        data.from
                    );


                if (!rejecter) {
                    return;
                }


                sendToUser(

                    data.to,

                    "connection:rejected",

                    {

                        user: {

                            id:
                                rejecter.id,

                            username:
                                rejecter.username,

                            avatar:
                                rejecter.avatar

                        }

                    }

                );

            }
        );


        /* =================================================
           CALL REQUEST
        ================================================= */

        socket.on(
            "call:request",
            data => {

                console.log(
                    "📞 Call request:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                const caller =
                    getUserById(
                        data.from
                    );


                if (!caller) {
                    return;
                }


                sendToUser(

                    data.to,

                    "call:incoming",

                    {

                        from: {

                            id:
                                caller.id,

                            username:
                                caller.username,

                            avatar:
                                caller.avatar

                        }

                    }

                );

            }
        );


        /* =================================================
           CALL ACCEPT
        ================================================= */

        socket.on(
            "call:accept",
            data => {

                console.log(
                    "📞 Call accepted:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                sendToUser(

                    data.to,

                    "call:accepted",

                    {

                        from:
                            data.from

                    }

                );

            }
        );


        /* =================================================
           CALL REJECT
        ================================================= */

        socket.on(
            "call:reject",
            data => {

                console.log(
                    "📞 Call rejected:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                sendToUser(

                    data.to,

                    "call:rejected",

                    {

                        from:
                            data.from

                    }

                );

            }
        );


        /* =================================================
           CALL END
        ================================================= */

        socket.on(
            "call:end",
            data => {

                console.log(
                    "📞 Call ended:",
                    data
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to
                ) {

                    return;

                }


                sendToUser(

                    data.to,

                    "call:ended",

                    {

                        from:
                            data.from

                    }

                );

            }
        );


        /* =================================================
           WEBRTC OFFER
        ================================================= */

        socket.on(
            "webrtc:offer",
            data => {

                console.log(
                    "📡 WebRTC offer"
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to ||
                    !data.offer
                ) {

                    return;

                }


                sendToUser(

                    data.to,

                    "webrtc:offer",

                    {

                        from:
                            data.from,

                        offer:
                            data.offer

                    }

                );

            }
        );


        /* =================================================
           WEBRTC ANSWER
        ================================================= */

        socket.on(
            "webrtc:answer",
            data => {

                console.log(
                    "📡 WebRTC answer"
                );


                if (
                    !data ||
                    !data.from ||
                    !data.to ||
                    !data.answer
                ) {

                    return;

                }


                sendToUser(

                    data.to,

                    "webrtc:answer",

                    {

                        from:
                            data.from,

                        answer:
                            data.answer

                    }

                );

            }
        );


        /* =================================================
           ICE CANDIDATE
        ================================================= */

        socket.on(
            "webrtc:ice-candidate",
            data => {

                if (
                    !data ||
                    !data.from ||
                    !data.to ||
                    !data.candidate
                ) {

                    return;

                }


                sendToUser(

                    data.to,

                    "webrtc:ice-candidate",

                    {

                        from:
                            data.from,

                        candidate:
                            data.candidate

                    }

                );

            }
        );


        /* =================================================
           DISCONNECT
        ================================================= */

        socket.on(
            "disconnect",
            reason => {

                const userId =
                    socket.ovcUserId;


                console.log(
                    "🔌 Socket disconnected:",
                    socket.id,
                    reason
                );


                if (!userId) {
                    return;
                }


                const user =
                    onlineUsers.get(
                        userId
                    );


                /*
                    Only remove user if this
                    socket is still the active socket.
                */

                if (
                    user &&
                    user.socketId ===
                    socket.id
                ) {

                    onlineUsers.delete(
                        userId
                    );


                    console.log(
                        `🔴 ${user.username} went offline`
                    );


                    io.emit(
                        "user:offline",
                        {

                            id:
                                user.id

                        }
                    );

                }

            }
        );

    }
);


/* =====================================================
   START SERVER
===================================================== */

server.listen(
    PORT,
    () => {

        console.log(
            "===================================="
        );

        console.log(
            "🚀 OVC Signaling Server Started"
        );

        console.log(
            `📡 Port: ${PORT}`
        );

        console.log(
            `🌐 http://localhost:${PORT}`
        );

        console.log(
            "===================================="

        );

    }
);