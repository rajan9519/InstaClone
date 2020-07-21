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
    type: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
      secure_url: {
        type: String,
        default: "",
      },
      format: {
        type: String,
        default: "",
      },
    },
    default: () => ({}),
  },
});

mongoose.model("User", userSchema);
