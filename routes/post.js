const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Post = mongoose.model("Post");
router.get("/", (req, res) => {
  res.send("you are in posts routes");
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
