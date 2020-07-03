const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

io.on("connect", (socket) => {
  socket.on("join", (name) => {
    console.log(`${name} is online now`);
  });
  socket.on("disconnect", () => {
    console.log(`user left ${socket.id}`);
  });
});

server.listen(8000, () => {
  console.log(`Listening at 8000`);
});
