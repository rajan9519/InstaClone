const mongoose = require("mongoose");
const followSchema = new mongoose.Schema({
  followerId: {
    type: String,
    ref: "User",
  },
  followeeId: {
    type: String,
    ref: "User",
  },
});

mongoose.model("Follow", followSchema);
