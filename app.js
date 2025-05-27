const express = require("express");
const app = express();
const path = require("path");
const socket = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
// app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});

io.on("connection", (uniqueSocket) => {
    console.log("A user connected: " + uniqueSocket.id);

    uniqueSocket.on("user-location", (data) => {
        io.emit("update-location", { id: uniqueSocket.id, data: data });
    });
    
// Correct handle disconnect here
    uniqueSocket.on("disconnect", () => {
        console.log("A user disconnected: " + uniqueSocket.id);
        io.emit("user-disconnected", { id: uniqueSocket.id });
    });
});



server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
