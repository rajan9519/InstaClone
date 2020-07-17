const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    between: {
      type: [
        {
          type: String,
          ref: "User",
        },
      ],
      validate: [
        (val) => val.length == 2,
        "between should contain exactly 2 elements",
      ],
      required: true,
    },
    lastMessage: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
mongoose.model("Conversation", conversationSchema);
