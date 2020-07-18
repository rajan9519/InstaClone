const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  follower: {
    type: Number,
    default: 0,
  },
  followee: {
    type: Number,
    default: 0,
  },
  dp: {
    type: String,
    default: "5cdefe5743ccde84a138c041b6f27dce.jpg",
  },
});

mongoose.model("User", userSchema);
