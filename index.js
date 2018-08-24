const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", socket => {
  socket.on("join", ({ name, time }) => {
    socket.username = name;
    socket.broadcast.emit("join", { name: name, time: time });
  });
});

server.listen(8080);
