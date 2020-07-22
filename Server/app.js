const connection = require("./models/index");
const express = require("express");

const register = require("./routes/auth");
const posts = require("./routes/post");
const user = require("./routes/user");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/", register);
app.use("/post", posts);
app.use("/user", user);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("listening port 5000");
});
