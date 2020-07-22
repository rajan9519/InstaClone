const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const loggedIn = require("../middleware/loggedIn");
const {
  uploadImage,
  removeImage,
  formParser,
} = require("../middleware/upload");

const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Comment = mongoose.model("Comment");
const Follow = mongoose.model("Follow");
const User = mongoose.model("User");

router.put("/uploaddp", loggedIn, formParser.single("file"), (req, res) => {
  // Remove the previous dp from the database and then upload the new one,

  uploadImage(req)
    .then((result) => {
      const picture = {
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url,
        format: result.format,
      };

      User.findByIdAndUpdate(
        req.user._id,
        { $set: { dp: picture } },
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
    })
    .catch((err) => {
      console.log(err);
      return res.json({
        error: "Unable to uplaod the Profile Please try again",
      });
    });

  if (req.user.dp.secure_url) {
    removeImage(req.user.dp.public_id)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        // add this public_id to the pending delete database
        console.log(error);
      });
  }
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
                        res.json({ ifollow: true, result });
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
    .then((users) => {
      Promise.all(users.map((user) => follow(user)))
        .then((data) => {
          res.json({ users, data });
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
      if (user && req.params._id) {
        res.json({ error: "Username Already Taken" });
      } else {
        res.send({ message: "Username Available" });
      }
    }
  });
});

router.get("/:id/:type", loggedIn, (req, res) => {
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
  if (req.params.type === "followers") {
    Follow.find({ followeeId: req.params.id })
      .populate("followerId", "name _id dp")
      .exec((err, users) => {
        if (err) {
          console.log("some database error 236", err);
          return res.status(500);
        }
        console.log(users);
        if (users.length) {
          console.log(users);
          Promise.all(users.map((user) => follow(user.followerId))).then(
            (data) => {
              res.json({
                ifollow: data,
                users: users.map((user) => user.followerId),
              });
            }
          );
        } else {
          res.json({ users: "", ifollow: "" });
        }
      });
  } else if (req.params.type === "followings") {
    Follow.find({ followerId: req.params.id })
      .populate("followeeId", "name _id dp")
      .exec((err, users) => {
        if (err) {
          console.log("some database error line 257");
          return res.status(500);
        }
        console.log(users);
        if (users.length) {
          Promise.all(users.map((user) => follow(user.followeeId))).then(
            (data) => {
              res.json({
                ifollow: data,
                users: users.map((user) => user.followeeId),
              });
            }
          );
        } else {
          res.json({ users: "", ifollow: "" });
        }
      });
  } else {
    res.status(404).send("invalid request");
  }
});
module.exports = router;
