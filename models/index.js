const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/insta",
  { useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("Succesfully connected to the database");
    } else {
      console.log("error connecting Database");
    }
  }
);
const User = require("./user");
