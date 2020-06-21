const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const likeSchema = new mongoose.Schema({
  likedBy: {
    type: ObjectId,
    ref: "User",
  },
  postId: {
    type: ObjectId,
    ref: "Post",
  },
});

mongoose.model("Like", likeSchema);
