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

const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

router.get("/", loggedIn, (req, res) => {
  const liked = (post) => {
    return new Promise((resolve, reject) => {
      Like.find(
        { likedBy: req.headers.userid, postId: post._id },
        (err, liked) => {
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
        }
      );
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

router.get("/test/:filename", (req, res) => {
  res.send(
    `<img src="/post/image/${req.params.filename}" width="100%" height="100%" alt=""></img>`
  );
});
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

router.post("/createPost", loggedIn, upload.single("file"), (req, res) => {
  const { title, body, userId } = req.body;
  if (!title || !body) {
    res.status(422).json({ error: "Please add all the fields" });
    return;
  }
  const post = new Post({
    title,
    body,
    postedBy: userId,
    fileName: req.filename,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result, message: "Post Created" });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("succesully uploaded image");
});

router.put("/like", loggedIn, (req, res) => {
  const { postId, userId, isLiked } = req.body;

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
        return res.json({ error: "Post Already Liked" });
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
        res.json({ error: "Post haven't Liked Yet" });
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

router.put("/comment", loggedIn, (req, res) => {
  const comment = new Comment({
    commentBy: req.body.userId,
    commentOn: req.body.postId,
    comment: req.body.text,
  });

  comment
    .save()
    .then((result) => {
      console.log(result);

      Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $inc: { numComments: 1 } },
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
});

module.exports = router;
