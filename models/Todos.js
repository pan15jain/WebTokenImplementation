const mongoose = require("mongoose");

const TodosSchema = mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

module.exports = mongoose.model("todo", TodosSchema);
