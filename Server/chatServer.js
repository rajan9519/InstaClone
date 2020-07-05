const connection = require("./models/index");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const { resolve } = require("path");
const { rejects } = require("assert");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const Message = mongoose.model("Message");

app.use(cors());

const user = {};

io.on("connect", (socket) => {
  socket.on("join", (username) => {
    //socket.join();
    console.log(`${username} is online now`);
    user[username] = socket.id;
  });
  socket.on("send", (data) => {
    const message = new Message({
      senderId: data.from,
      recieverId: data.to,
      message: data.message,
    });
    new Promise((resolve, reject) => {
      message
        .save()
        .then((data) => {
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    })
      .then((yes) => {
        if (yes) {
          io.to(user[data.to]).emit("message", {
            message: data.message,
            from: data.from,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("disconnect", () => {
    console.log(`user left ${socket.id}`);
  });
});

server.listen(8000, () => {
  console.log(`Listening at 8000`);
});
