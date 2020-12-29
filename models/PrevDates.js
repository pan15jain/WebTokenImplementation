const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

const prevdateSchema = mongoose.Schema({
  caseid: ObjectId,
  previousDate: Date,
  purpose: String,
});

module.exports = mongoose.model("prevdates", prevdateSchema);
