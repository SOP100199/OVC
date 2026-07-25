const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "OVC Signaling Server"
    });
});

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("register-user", (user) => {

        socket.user = user;

        console.log(
            "Registered:",
            user.username,
            socket.id
        );

    });

    socket.on("connection-request", (data) => {

        // Forward request to target user
        io.to(data.targetSocketId).emit(
            "incoming-connection-request",
            {
                from: socket.id,
                user: data.user
            }
        );

    });

    socket.on("connection-response", (data) => {

        io.to(data.targetSocketId).emit(
            "connection-response",
            {
                accepted: data.accepted,
                user: data.user
            }
        );

    });

    socket.on("webrtc-offer", (data) => {

        io.to(data.targetSocketId).emit(
            "webrtc-offer",
            {
                offer: data.offer,
                from: socket.id
            }
        );

    });

    socket.on("webrtc-answer", (data) => {

        io.to(data.targetSocketId).emit(
            "webrtc-answer",
            {
                answer: data.answer,
                from: socket.id
            }
        );

    });

    socket.on("ice-candidate", (data) => {

        io.to(data.targetSocketId).emit(
            "ice-candidate",
            {
                candidate: data.candidate,
                from: socket.id
            }
        );

    });

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `OVC signaling server running on port ${PORT}`
    );

});