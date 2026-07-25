const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        app: "OVC",
        message: "OVC server is running"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`OVC server running on port ${PORT}`);
});