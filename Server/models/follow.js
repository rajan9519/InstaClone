const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const followSchema = new mongoose.Schema({
  followerId: {
    type: ObjectId,
    ref: "User",
  },
  followeeId: {
    type: ObjectId,
    ref: "User",
  },
});

mongoose.model("Follow", followSchema);
