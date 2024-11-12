const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String },
  source: { type: String },
});

module.exports = mongoose.model("video", videoSchema);
