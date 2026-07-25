const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your frontend files
app.use(express.static(__dirname));

// Main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        app: "OVC",
        message: "OVC server is running"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`OVC server running on port ${PORT}`);
});