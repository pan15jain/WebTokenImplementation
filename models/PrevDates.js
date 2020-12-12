const mongoose = require("mongoose");

const prevdateSchema = mongoose.Schema({
  caseId: String,
  previousDate: Date,
  purpose: String,
});

module.exports = mongoose.model("prevdates", prevdateSchema);
