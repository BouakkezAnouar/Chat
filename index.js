const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const ent = require("ent");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", socket => {
  socket.on("join", ({ name, time }) => {
    name = ent.encode(name);
    socket.username = name;
    socket.broadcast.emit("join", { name: name, time: time });
  });

  socket.on("message", ({ message, time }) => {
    message = ent.encode(message);
    let messageObj = {
      message,
      from: socket.username,
      time
    };
    socket.broadcast.emit("message", messageObj);
    socket.emit("message", messageObj);
  });
});

server.listen(8080);
