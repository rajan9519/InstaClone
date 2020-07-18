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
    default: "ac135f21f90f240e34b138207e0bf5bc.jpg",
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now,
  },
});

mongoose.model("Pending", pendingSchema);
