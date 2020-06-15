const connection = require("./models/index");
const express = require("express");
const bodyParser = require("body-parser");

const register = require("./routes/auth");
const app = express();

app.use(express.json());
app.use("/", register);

app.listen(3000, () => {
  console.log("listening port 3000");
});
