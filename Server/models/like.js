const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema({
  likedBy: {
    type: String,
    ref: "User",
  },
  postId: {
    type: String,
    ref: "Post",
  },
});

mongoose.model("Like", likeSchema);
