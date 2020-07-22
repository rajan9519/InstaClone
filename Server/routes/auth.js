const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

const { JWT_SECRET, EMAIL } = require("../config/key");
const User = mongoose.model("User");
const SocketInfo = mongoose.model("SocketInfo");
const Pending = mongoose.model("Pending");

const emailExist = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      });
  });
};
const emailExistPending = (email, _id) => {
  return new Promise((resolve, reject) => {
    Pending.find({ $or: [{ email }, { _id }] })
      .then((user) => {
        if (user.length) {
          console.log(user);
          resolve(true);
        } else {
          console.log("not found");
          resolve(false);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      });
  });
};

router.get("/validate/:email/:token", (req, res) => {
  emailExist(req.params.email)
    .then((yes) => {
      if (yes) {
        return res.send("User already Verified");
      } else {
        Pending.findOne({ token: req.params.token }).then((data) => {
          if (data) {
            bcrypt
              .hash(data.password, 12)
              .then((hashedPassword) => {
                const user = new User({
                  _id: data._id,
                  email: data.email,
                  name: data.name,
                  password: hashedPassword,
                });

                user
                  .save()
                  .then((user) => {
                    const socketUser = new SocketInfo({
                      userId: user._id,
                    });
                    socketUser.save();
                    return res.send(`
                    <div>
                      <p>You have successfully Verified Your account</p>
                      <p>Now you can sign in</p>
                      <a href="https://rajan9519.herokuapp.com/">https://rajan9519.herokuapp.com/<a>
                    </div>
                    `);
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.send("Some Internal Sever error");
                  });
              })
              .catch((err) => {
                console.log(err);
                return res.send("some internal server error");
              });
          } else {
            return res.send(
              `<div>
                <p>Either you have already verified your account or link has expired</p>
                <p>Please create your account again</p>
                <a href="https://rajan9519.herokuapp.com/">https://rajan9519.herokuapp.com/<a>
              </div>
            `
            );
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("some internal server error");
    });
});

router.post("/signup", (req, res) => {
  let { _id, name, email, password } = req.body;
  _id = _id.trim();
  name = name.trim();
  email = email.trim();
  password = password.trim();
  if (!name || !email || !password || !_id) {
    res.status(422).json({ error: "please add all the fields" });
    return;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    res.json({ error: "Invalid Email Address" });
    return;
  } else if (_id.toLowerCase() != _id) {
    res.json({ error: "username must be all lowercase" });
  }
  emailExistPending(email, _id).then((yes) => {
    if (yes) {
      return res.json({ error: "You have already register please verify" });
    } else {
      User.findOne({ email })
        .then((savedUser) => {
          if (savedUser) {
            res.json({
              error: "user already exist with the same email address",
            });
            return;
          }
          crypto.randomBytes(32, (err, buffer) => {
            if (err) {
              console.log(err);
              res.send("Some Internal Error");
              return;
            } else {
              const token = buffer.toString("hex");
              const pending = new Pending({
                _id,
                name,
                email,
                password,
                token,
              });

              pending
                .save()
                .then((pend) => {
                  sgMail.setApiKey(require("../config/key").SENDGRID);
                  const msg = {
                    to: email,
                    from: "rajan@mygluecode.com",
                    subject: "Confirm your account on MyGlueCode",
                    text: "MyGlueCode Team",
                    html: `
                    <p>Thanks for signing up with MyGlueCode! You must follow this link to activate your account:</p>
                    <p>Email: ${email}</p>
                    <p>Password: ${password}</p>
                    <a href="${EMAIL}/validate/${email}/${token}"> ${EMAIL}/validate/${email}/${token} </a>
                    <p>Have fun, and don't hesitate to contact us with your feedback.</p>
                    <p>The MyGlueCode team</p>
                    <a href="https://rajan9519.herokuapp.com/"> https://rajan9519.herokuapp.com/ </a>
                    `,
                  };
                  sgMail
                    .send(msg)
                    .then(() => console.log("success"))
                    .catch(() => console.log("error"));
                  return res.json({ message: "Please Check Your Email" });
                })
                .catch((err) => {
                  console.log(err);
                  return res.json({ error: err });
                });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({ error: "internal server error" });
        });
    }
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
