const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const loggedIn = require("../middleware/loggedIn");

const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Comment = mongoose.model("Comment");
const Follow = mongoose.model("Follow");
const User = mongoose.model("User");

router.get("/:id", loggedIn, (req, res) => {
  console.log("routing");
  User.findById(req.params.id)
    .select("-password")
    .exec((err, user) => {
      if (err) {
        console.log("some database error");
      } else {
        Post.find({ postedBy: req.params.id })
          .populate("postedBy", "_id name")
          .then((userPost) => {
            res.json({ user, userPost });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.post("/follow", loggedIn, (req, res) => {
  const { followerId, followeeId, unfollow } = req.body;
  if (unfollow) {
    Follow.deleteOne({ followerId, followeeId }, (err) => {
      if (err) {
        console.log(err);
      } else {
        User.findByIdAndUpdate(
          followerId,
          { $inc: { followee: -1 } },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              // res.send(result);
              User.findByIdAndUpdate(
                followeeId,
                { $inc: { follower: -1 } },
                { new: true },
                (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  } else {
                    res.send(result);
                  }
                }
              );
            }
          }
        );
      }
    });
  } else {
    const follow = new Follow({
      followerId,
      followeeId,
    });
    follow
      .save()
      .then((follow) => {
        User.findByIdAndUpdate(
          followerId,
          { $inc: { followee: 1 } },
          { new: true },
          (err, result) => {
            if (err) {
              res.json({ error: err });
              return;
            } else {
              User.findByIdAndUpdate(
                followeeId,
                { $inc: { follower: 1 } },
                { new: true },
                (err, result) => {
                  if (err) {
                    res.json({ error: err });
                    return;
                  } else {
                    res.send(result);
                  }
                }
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/ifollow", loggedIn, (req, res) => {
  console.log(req.body);
  const { followerId, followeeId } = req.body;
  Follow.find({ followerId, followeeId }).exec((err, result) => {
    if (err || !result.length) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

module.exports = router;
