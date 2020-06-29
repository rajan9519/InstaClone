const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../keys");
const User = mongoose.model("User");

router.get("/", (req, res) => {
  res.send("you on authentication router");
});

router.post("/signup", (req, res) => {
  const { _id, name, email, password } = req.body;
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
            _id,
            name,
            email,
            password: hashedPassword,
          });
          user
            .save()
            .then((user) => {
              return res.json({ message: "Successfully Signed Up" });
            })
            .catch((err) => {
              console.log(err);
              return res.json({ error: err });
            });
        })
        .catch((err) => {
          console.log(err);
          return res.json({ error: "internal server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: "internal server error" });
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please provide Email and Password" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      res.status(422).json({ error: "Invalid Email or Password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((matched) => {
        if (matched) {
          // res.json({ message: "User Exist" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          savedUser.password = undefined;
          res.json({
            message: "Successfully Signed In",
            token,
            user: savedUser,
          });
        } else {
          res.json({ error: "Invalid Email Or Password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
module.exports = router;
