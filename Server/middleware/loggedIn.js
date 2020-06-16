const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "You Must first log in" });
    return;
  }
  const token = authorization;
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(401).json({ error: "You Must first log in" });
      return;
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
