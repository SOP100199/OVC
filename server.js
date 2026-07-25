const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        app: "OVC",
        message: "OVC signaling server is running"
    });
});

const users = new Map();

io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );

    socket.on("register-user", (user) => {

        if (
            !user ||
            !user.id
        ) {
            return;
        }

        users.set(
            user.id,
            {
                ...user,
                socketId: socket.id
            }
        );

        socket.userId =
            user.id;

        console.log(
            "User registered:",
            user.username,
            user.id
        );

    });

    socket.on(
        "find-user",
        (
            userId,
            callback
        ) => {

            const user =
                users.get(userId);

            if (
                typeof callback ===
                "function"
            ) {

                callback(
                    user || null
                );

            }

        }
    );

    socket.on(
        "connection-request",
        (data) => {

            const target =
                users.get(
                    data.to
                );

            if (!target) {

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
                target.socketId
            ).emit(
                "connection-request",
                {
                    from:
                        data.from
                }
            );

        }
    );

    socket.on(
        "connection-response",
        (data) => {

            const target =
                users.get(
                    data.to
                );

            if (!target) {
                return;
            }

            io.to(
                target.socketId
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

    socket.on(
        "webrtc-offer",
        (data) => {

            const target =
                users.get(
                    data.to
                );

            if (!target) {
                return;
            }

            io.to(
                target.socketId
            ).emit(
                "webrtc-offer",
                data
            );

        }
    );

    socket.on(
        "webrtc-answer",
        (data) => {

            const target =
                users.get(
                    data.to
                );

            if (!target) {
                return;
            }

            io.to(
                target.socketId
            ).emit(
                "webrtc-answer",
                data
            );

        }
    );

    socket.on(
        "ice-candidate",
        (data) => {

            const target =
                users.get(
                    data.to
                );

            if (!target) {
                return;
            }

            io.to(
                target.socketId
            ).emit(
                "ice-candidate",
                data
            );

        }
    );

    socket.on(
        "call-ended",
        (data) => {

            const target =
                users.get(
                    data.to
                );

            if (!target) {
                return;
            }

            io.to(
                target.socketId
            ).emit(
                "call-ended",
                data
            );

        }
    );

    socket.on(
        "disconnect",
        () => {

            if (
                socket.userId
            ) {

                users.delete(
                    socket.userId
                );

            }

            console.log(
                "Socket disconnected:",
                socket.id
            );

        }
    );

});

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `OVC signaling server running on port ${PORT}`
        );

    }
);