const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const loggedIn = require("../middleware/loggedIn");

const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Comment = mongoose.model("Comment");
const Follow = mongoose.model("Follow");

router.get("/:id", loggedIn, (req, res) => {
  console.log("routing");
  Post.find({ postedBy: req.params.id })
    .populate("postedBy", "_id name")
    .then((userPost) => {
      res.send(userPost);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/follow", loggedIn, (req, res) => {
  const { followerId, followeeId } = req.body;

  Follow.findOne({ followerId, followeeId }).then((alreadyFollowed) => {
    if (alreadyFollowed) {
      res.json({ error: "You have already followed this user" });
      return;
    }

    const follow = new Follow({
      followerId,
      followeeId,
    });
    follow
      .save()
      .then((follow) => {
        res.json({ message: "followed succesfully" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
