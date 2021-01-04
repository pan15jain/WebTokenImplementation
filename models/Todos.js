const mongoose = require("mongoose");

const TodosSchema = mongoose.Schema({
  title: String,
  description: String,
  status: String,
  duedate: Date,
  comdate: Date,
});

module.exports = mongoose.model("todos", TodosSchema);
