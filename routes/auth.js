const mongoose = require("mongoose");
const express = require("express");
const { response } = require("express");
const router = express.Router();
const User = mongoose.model("User");

router.get("/", (req, res) => {
  res.send("you on authentication router");
});

router.post("/signup", (req, res) => {
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
      const user = new User({
        name,
        email,
        password,
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
});

module.exports = router;
