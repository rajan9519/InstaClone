const connection = require("./models/index");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const Message = mongoose.model("Message");
const SocketInfo = mongoose.model("SocketInfo");

app.use(cors());

const getSocketId = (username) => {
  return new Promise((resolve, reject) => {
    SocketInfo.findOne({ userId: username }, (err, result) => {
      if (err) {
        resolve({ error: err });
      } else {
        resolve({ result });
      }
    });
  });
};

io.on("connect", (socket) => {
  socket.on("join", (username) => {
    username = username.trim();
    SocketInfo.findOneAndUpdate(
      { userId: username },
      { $set: { online: true, socketId: socket.id } },
      { new: true },
      (err, result) => {
        console.log("error: ", err, " result: ", result);
        io.to(socket.id).emit("connected");
      }
    );

    console.log(`${username} is online now`);
  });
  socket.on("convwith", (data) => {
    new Promise((resolve, reject) => {
      Message.find(
        {
          recieverId: { $in: [data.you, data.other] },
          senderId: { $in: [data.you, data.other] },
        },
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
          console.log(result.error);
        } else {
          //send the pending messages

          getSocketId(data.you)
            .then((socketData) => {
              if (socketData.error) {
                console.log(socketData.error);
              } else {
                result.data.map((data) => {
                  console.log(socketData.result.socketId);
                  io.to(socketData.result.socketId).emit("message", data);
                  console.log(data);
                });
              }
            })
            .catch((err) => {
              console.log(err);
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
          getSocketId(result.data.recieverId)
            .then((socketData) => {
              if (socketData.error) {
                console.log(socketData.error);
              } else {
                io.to(socketData.result.socketId).emit("message", result.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
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
    SocketInfo.findOneAndUpdate(
      { socketId: socket.id },
      { $set: { online: false } },
      { new: true },
      (err, result) => {
        console.log("error ", err, " result", result);
      }
    );
  });
});

server.listen(8000, () => {
  console.log(`Listening at 8000`);
});
