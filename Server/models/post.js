const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  numLikes: {
    type: Number,
    default: 0,
  },
  postedBy: {
    type: String,
  },
});

mongoose.model("Post", postSchema);
