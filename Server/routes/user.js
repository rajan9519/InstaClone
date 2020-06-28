const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const loggedIn = require("../middleware/loggedIn");
const upload = require("../middleware/upload");
const mongoURI = require("../keys").MONGO_URL;

const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Comment = mongoose.model("Comment");
const Follow = mongoose.model("Follow");
const User = mongoose.model("User");

const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

router.get("/uploaddp", loggedIn, upload.single("file"), (req, res) => {
  gfs.remove(
    { _id: mongoose.mongo.ObjectId("5ef5a0d3202f3417ec15c9c3") },
    (err, result) => {
      if (err) {
        return res.json({ error: err });
      } else {
        console.log("Successfully deleted ", result);
        res.send("oh yeah");
        User.findByIdAndUpdate(
          req.user._id,
          { $set: { dp: req.filename } },
          { new: true },
          (err, result) => {
            if (err) {
              return res.json({ error: err });
            } else {
              res.send(result);
              console.log("succesfully updated ");
            }
          }
        );
      }
    }
  );
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

router.post("/:user", loggedIn, (req, res) => {
  const userPattern = new RegExp("^" + req.params.user);
  User.find({ email: { $regex: userPattern } })
    .select("_id name")
    .then((user) => {
      res.send(user);
    })
    .catch((err) => console.log(err));
});

router.get("/:id", loggedIn, (req, res) => {
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
module.exports = router;
