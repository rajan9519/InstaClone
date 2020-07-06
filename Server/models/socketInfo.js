const { mongo } = require("mongoose");

const mongoose = require("mongoose");

const socketInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    online: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

mongoose.model("SocketInfo", socketInfoSchema);
