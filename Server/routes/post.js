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

router.get("/", loggedIn, (req, res) => {
  const liked = (post) => {
    return new Promise((resolve, reject) => {
      Like.find({ likedBy: req.user._id, postId: post._id }, (err, liked) => {
        console.log(liked);
        if (err) {
          reject(err);
        }
        if (liked.length) {
          post.isLiked = true;
          resolve(post);
        } else {
          post.isLiked = false;
          resolve(post);
        }
      });
    });
  };

  const handleLike = (posts) => {
    return Promise.all(
      posts.map((post) => {
        return liked(post);
      })
    )
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Post.find({}, (err, posts) => {
  //   if (err) {
  //     return res.json({ error: "Unable to find the post" });
  //   } else {
  //     handleLike(posts).then((data) => {
  //       res.send(data);
  //     });
  //   }
  //   console.log("post requested and sent succesfully");
  // });

  Post.find()
    .populate("postedBy", "_id name dp")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) {
        return res.json({ error: "Unable to find the post" });
      } else {
        handleLike(posts).then((data) => {
          res.send(data);
        });
      }
      console.log("post requested and sent succesfully");
    });
});

router.post("/createPost", loggedIn, formParser.single("file"), (req, res) => {
  // add a security layer to verify the logged in user id and requested userid for the upload
  console.log(req.user);
  if (req.file) {
    const { text } = req.body;
    const userId = req.user._id;
    uploadImage(req)
      .then((result) => {
        const picture = {
          public_id: result.public_id,
          url: result.url,
          secure_url: result.secure_url,
          format: result.format,
        };
        const post = new Post({
          text,
          postedBy: userId,
          picture: picture,
        });

        post
          .save()
          .then((result) => {
            res.json({ post: result, message: "Post Created" });
            console.log("succesully uploaded image");
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              error: "Unable make post Please Try again",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.json({ error: "Unable to save the user Please try again" });
      });
  } else {
    res.json({ error: "Image Required" });
  }
});

router.put("/like", loggedIn, (req, res) => {
  const { postId, isLiked } = req.body;
  const userId = req.user._id;

  const liked = (userId, postId) => {
    return new Promise((resolve, reject) => {
      Like.findOne({ likedBy: userId, postId })
        .then((data) => {
          if (data) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(new Error("some Database Error"));
        });
    });
  };

  liked(userId, postId).then((yes) => {
    if (yes) {
      if (!isLiked) {
        Post.findByIdAndUpdate(
          { _id: postId },
          { $set: { isLiked: true } },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              return res.send(result);
            }
          }
        );
      } else {
        Like.deleteOne({ likedBy: userId, postId }, (err) => {
          if (err) {
            console.log(err);
          } else {
            Post.findByIdAndUpdate(
              { _id: postId },
              { $inc: { numLikes: -1 }, $set: { isLiked: false } },
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
        });
      }
    } else {
      if (isLiked) {
        Post.findByIdAndUpdate(
          { _id: postId },
          { $set: { isLiked: true } },
          { new: false },
          (err, result) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              return res.send(result);
            }
          }
        );
      } else {
        const like = new Like({
          postId: postId,
          likedBy: userId,
        });

        like
          .save()
          .then((result) => {
            console.log(result);

            Post.findByIdAndUpdate(
              { _id: postId },
              { $inc: { numLikes: 1 }, $set: { isLiked: true } },
              { new: true },
              (err, result) => {
                if (err) {
                  return res.status(500).send(err);
                } else {
                  res.send(result);
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
router.get("/comment/:postId", loggedIn, (req, res) => {
  Comment.find({ commentOn: req.params.postId })
    .sort("-createdAt")
    .exec((err, result) => {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        console.log(result);
        res.send(result);
      }
    });
});
router.put("/comment", loggedIn, (req, res) => {
  const comment = new Comment({
    commentBy: req.user._id,
    commentOn: req.body.postId,
    comment: req.body.text,
  });

  comment
    .save()
    .then((result1) => {
      console.log(result1);

      Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $inc: { numComments: 1 } },
        { new: true },
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            res.send(result1);
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/delete/:id", loggedIn, (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id })
    .then((data) => {
      if (data) {
        console.log(data);
        res.json({ message: "Post Deleted Succesfully" });
        removeImage(data.picture.public_id)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            // add this public_id to the pending delete database
            console.log(error);
          });
      } else {
        res.json({ error: "Unauthorized Deletion or Post not found by you" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({ error: "Unable to delete the post Please try again" });
    });
});

module.exports = router;
