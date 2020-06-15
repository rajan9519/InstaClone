const connection = require("./models/index");
const express = require("express");
const bodyParser = require("body-parser");

const register = require("./routes/auth");
const posts = require("./routes/post");
const loggedIn = require("./middleware/loggedIn");
const app = express();

app.use(express.json());
app.use("/", register);
app.use("/post", loggedIn, posts);

app.listen(3000, () => {
  console.log("listening port 3000");
});
