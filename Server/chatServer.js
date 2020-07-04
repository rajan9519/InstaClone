const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

const user = {};

io.on("connect", (socket) => {
  socket.on("join", (username) => {
    //socket.join();
    console.log(`${username} is online now`);
    user[username] = socket.id;
  });
  socket.on("send", (data) => {
    io.to(user[data.to]).emit("message", {
      message: data.message,
      from: data.from,
    });
  });
  socket.on("disconnect", () => {
    console.log(`user left ${socket.id}`);
  });
});

server.listen(8000, () => {
  console.log(`Listening at 8000`);
});
