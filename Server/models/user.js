const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    default:
      "https://f0.pngfuel.com/png/981/645/default-profile-picture-png-clip-art.png",
  },
});

mongoose.model("User", userSchema);
