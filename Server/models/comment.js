const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const commentSchema = new mongoose.Schema({
  commentBy: {
    type: ObjectId,
    ref: "User",
  },
  commentOn: {
    type: ObjectId,
    ref: "Post",
  },
});

mongoose.model("Comment", commentSchema);
