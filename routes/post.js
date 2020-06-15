const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Post = mongoose.model("Post");
router.get("/", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createPost", (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(422).json({ error: "Please add all the fields" });
    return;
  }
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  req.user.password = undefined;
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
