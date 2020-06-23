const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const loggedIn = require("../middleware/loggedIn");
const mongoURI = require("../keys").MONGO_URL;

const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Comment = mongoose.model("Comment");
const Follow = mongoose.model("Follow");

const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        req.filename = filename;
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

router.get("/", loggedIn, (req, res) => {
  // Post.find()
  //   .populate("postedBy", "_id name")
  //   .then((posts) => {
  //     res.json({ posts });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // gfs.files.find().toArray((err, files) => {
  //   // Check if files

  //   res.json(files);
  // });

  const isLiked = (post) => {
    Like.find(
      { likedBy: req.headers.userId, postId: post._id },
      (err, liked) => {
        if (err) {
          return res.json({ error: "unable to find likes by the user" });
        } else {
          if (liked) {
            post.isLiked = true;
          } else {
            post.isLiked = false;
          }
          console.log("mapping");
        }
      }
    );
  };

  Post.find({}, (err, posts) => {
    if (err) {
      return res.json({ error: "Unable to find the post" });
    } else {
      posts.map((post) => {
        isLiked(post);
        console.log("data mapped");
        return post;
      });
      console.log("data is send");
      res.send(posts);
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
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(422).json({ error: "Please add all the fields" });
    return;
  }
  const post = new Post({
    title,
    body,
    postedBy: JSON.stringify(req.user),
    fileName: req.filename,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("succesully uploaded image");
});

router.put("/like", loggedIn, (req, res) => {
  const like = new Like({
    postId: req.body.postId,
    likedBy: req.body.userId,
  });

  like
    .save()
    .then((result) => {
      console.log(result);

      Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $inc: { numLikes: 1 } },
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

router.get("/myposts", loggedIn, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
