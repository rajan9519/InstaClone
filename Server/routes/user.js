const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const loggedIn = require("../middleware/loggedIn");

const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Comment = mongoose.model("Comment");
const Follow = mongoose.model("Follow");

router.get("/:id", loggedIn, (req, res) => {
  Post.find({ postedBy: req.params.id })
    .populate("postedBy", "_id name")
    .then((userPost) => {
      res.send(userPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
