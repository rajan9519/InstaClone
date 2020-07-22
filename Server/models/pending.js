const mongoose = require("mongoose");

const pendingSchema = new mongoose.Schema({
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
    default: "",
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: 600,
    default: Date.now,
  },
});

mongoose.model("Pending", pendingSchema);
