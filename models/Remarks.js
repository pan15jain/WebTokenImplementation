const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

const remarkSchema = mongoose.Schema({
  caseid: ObjectId,
  remarkDate: Date,
  note: String,
});

module.exports = mongoose.model("remarks", remarkSchema);
