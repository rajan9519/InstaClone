const connection = require("./models/index");
const express = require("express");
const bodyParser = require("body-parser");

const register = require("./routes/auth");
const app = express();

app.use("/", register);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(3000, () => {
  console.log("listening port 3000");
});
