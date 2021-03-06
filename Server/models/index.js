const mongoose = require("mongoose");

mongoose.connect(
  require("../config/key").MONGO_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("Succesfully connected to the database");
    } else {
      console.log("error connecting Database");
    }
  }
);
const Pending = require("./pending");
const User = require("./user");
const Post = require("./post");

const Like = require("./like");
const Comment = require("./comment");
const Follow = require("./follow");
const Message = require("./message");
const SocketInfo = require("./socketInfo");
