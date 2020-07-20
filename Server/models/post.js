const mongoose = require("mongoose");
//const { ObjectId } = mongoose.Schema.Types;

const pictureSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    picture: pictureSchema,
    numLikes: {
      type: Number,
      default: 0,
    },
    numComments: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: String,
      ref: "User",
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
mongoose.model("Picture", pictureSchema);
