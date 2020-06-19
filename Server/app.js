const connection = require("./models/index");
const express = require("express");

const register = require("./routes/auth");
const posts = require("./routes/post");
const loggedIn = require("./middleware/loggedIn");
const app = express();

app.use(express.json());
app.use("/", register);
app.use("/post", posts);

app.listen(5000, () => {
  console.log("listening port 5000");
});
