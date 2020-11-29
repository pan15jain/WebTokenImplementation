const mongoose = require("mongoose");

const remarkSchema = mongoose.Schema({
  caseId: String,
  remarkDate: Date,
  note: String,
});

module.exports = mongoose.model("remarks", remarkSchema);
