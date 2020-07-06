const connection = require("./models/index");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const { resolve } = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const Message = mongoose.model("Message");

app.use(cors());

const user = {};

io.on("connect", (socket) => {
  socket.on("join", (username) => {
    username = username.trim();
    //socket.join();
    console.log(`${username} is online now`);
    user[username] = socket.id;
    new Promise((resolve, reject) => {
      Message.find(
        { delivered: false, recieverId: username },
        (error, data) => {
          if (error) {
            console.log(error, "line 29");
            resolve({ error });
          } else {
            resolve({ data });
          }
        }
      );
    })
      .then((result) => {
        if (result.error) {
          // send an error message for the user
          socket.emit("pending", {
            error: "Unable to load messages Please try again",
          });
        } else {
          //send the pending messages
          result.data.map((data) => {
            io.to(user[data.recieverId]).emit("message", data);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("send", (data) => {
    const message = new Message({
      senderId: data.from.trim(),
      recieverId: data.to.trim(),
      message: data.message,
    });
    new Promise((resolve, reject) => {
      message
        .save()
        .then((data) => {
          console.log(data);
          resolve({ data });
        })
        .catch((err) => {
          resolve({ err });
        });
    })
      .then((result) => {
        if (result.data) {
          console.log(result.data);
          io.to(user[result.data.recieverId]).emit("message", result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("recieved", (_id) => {
    Message.findByIdAndUpdate(
      _id,
      {
        $set: { delivered: true },
      },
      { new: true },
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });
  socket.on("disconnect", () => {
    console.log(`user left ${socket.id}`);
  });
});

server.listen(8000, () => {
  console.log(`Listening at 8000`);
});
