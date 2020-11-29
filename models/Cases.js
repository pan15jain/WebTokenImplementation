const mongoose = require("mongoose");

const caseSchema = mongoose.Schema({
  id: String,
  fileNo: String,
  caseNo: String,
  applicantName: String,
  deceasedName: String,
  address: String,
  distt: String,
  phone: String,
  previousDate: Date,
  previousPurpose: String,
  nextDate: Date,
  nextPurpose: String,
});
module.exports = mongoose.model("cases", caseSchema);
