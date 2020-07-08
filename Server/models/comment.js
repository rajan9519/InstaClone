const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    commentBy: {
      type: String,
      ref: "User",
    },
    commentOn: {
      type: String,
      ref: "Post",
    },
  },
  { timestamps: true }
);

mongoose.model("Comment", commentSchema);
