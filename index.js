const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Message = require("./models/Message");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const ent = require("ent");

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost/chat")
  .then(() => console.log("connecting to mongo database"))
  .catch(err => console.log(err.message));

const message = new Message({
  from: "anouar",
  message: "salut tous le monde !"
});

//message.save().then(res => console.log(res));

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
