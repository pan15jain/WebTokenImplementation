const mongoose = require("mongoose");

const prevdateSchema = mongoose.Schema({
  caseid: String,
  previousDate: Date,
  purpose: String,
});

module.exports = mongoose.model("prevdates", prevdateSchema);
