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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//send messages to user
io.sockets.on("connection", socket => {
  //when user connect send him all messages
  Message.find()
    .then(messages => socket.emit("messages", messages))
    .catch(err => console.log(err.message));

  socket.on("join", async username => {
    username = ent.encode(username);
    socket.username = username;

    socket.broadcast.emit("join", {
      username,
      time: new Date()
    });
  });

  socket.on("message", async message => {
    message = ent.encode(message);

    let newMessage = new Message({
      message,
      from: socket.username
    });
    try {
      newMessage = await newMessage.save();
    } catch (err) {
      console.log(err.message);
    }
    socket.broadcast.emit("message", newMessage);
    socket.emit("message", newMessage);
  });
});

server.listen(8080);
