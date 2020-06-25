const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoURI = require("../keys").MONGO_URL;
const path = require("path");

const loggedIn = require("../middleware/loggedIn");
const { JWT_SECRET } = require("../keys");
const multer = require("multer");
const User = mongoose.model("User");

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

router.get("/", (req, res) => {
  res.send("you on authentication router");
});

router.post("/signup", upload.single("file"), (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ error: "please add all the fields" });
    return;
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        res.json({ error: "user already exist with the same email address" });
        return;
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            dp: req.filename,
          });
          user
            .save()
            .then((user) => {
              res.json({ message: "saved succesfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please provide email or password" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      res.status(422).json({ error: "Invalid User or Password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((matched) => {
        if (matched) {
          // res.json({ message: "User Exist" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          savedUser.password = undefined;
          res.json({ token, user: savedUser });
        } else {
          res.json({ message: "Invalid User Or Password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
module.exports = router;
