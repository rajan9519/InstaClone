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

router.put("/uploaddp", loggedIn, upload.single("file"), (req, res) => {
  gfs.files.remove({ filename: req.user.dp }, (err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      User.findByIdAndUpdate(
        req.user._id,
        { $set: { dp: req.filename } },
        { new: true },
        (err, result) => {
          if (err) {
            return res.json({ error: err });
          } else {
            res.send(result);
            console.log(result);
            console.log("succesfully updated ");
          }
        }
      );
    }
  });
});
router.post("/follow", loggedIn, (req, res) => {
  const { followerId, followeeId, unfollow } = req.body;

  const imfollowing = (followerId, followeeId) => {
    return new Promise((resolve, reject) => {
      Follow.findOne({ followerId, followeeId })
        .then((result) => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(new Error("Database Error"));
        });
    });
  };

  imfollowing(followerId, followeeId).then((yes) => {
    if (yes) {
      if (!unfollow) {
        console.log("you are following this user");
        User.findById(followeeId, (err, result) => {
          return res.json({ ifollow: true, result });
        });
      } else {
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
                        res.json({ ifollow: false, result });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    } else {
      if (unfollow) {
        User.findById(followeeId, (err, result) => {
          return res.json({ ifollow: false, result });
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
                        res.send(true);
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
    }
  });
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

  const follow = (user) => {
    return new Promise((resolve, reject) => {
      Follow.findOne({ followerId: req.user._id, followeeId: user._id })
        .then((data) => {
          if (data) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  };

  User.find({ _id: { $regex: userPattern } })
    .select("_id name dp")
    .then((user) => {
      Promise.all(user.map((user) => follow(user)))
        .then((data) => {
          res.json({ user, data });
        })
        .catch((err) => {
          console.log(err);
        });
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
router.get("/find/:_id", (req, res) => {
  User.findById(req.params._id).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.json({ error: "internal Server Error" });
    } else {
      if (user) {
        res.json({ error: "Username Already Taken" });
      } else {
        res.send({ message: "Username Available" });
      }
    }
  });
});
module.exports = router;
