const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("you on authentication router");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ error: "please add all the fields" });
    return;
  }
  res.json({ message: "succesfully registered" });
});

module.exports = router;
