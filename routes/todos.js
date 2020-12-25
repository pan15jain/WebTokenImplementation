const express = require("express");
const router = express.Router();
const model = require("../models/Todos");

router.get("/", async (req, res) => {
  try {
    console.log("hello");
    const todo = await model.find();
    console.log(todo);
    res.json({ TodoRecord: todo });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const savemodel = new model();
  savemodel.title = req.body.title;
  savemodel.description = req.body.description;
  savemodel.status = req.body.status;
  savemodel.duedate = req.body.duedate;
  if (req.body.status === "C") {
    savemodel.comdate = new Date();
  }
  try {
    const dataSaved = savemodel.save();
    res.json(dataSaved);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const record = await model.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        duedate: req.body.duedate,
        comdate: req.body.status === "C" ? new Date() : "",
      },
    });
    res.json(record);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const recordDeleted = await model.findByIdAndDelete(req.params.id);
    res.json(recordDeleted);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
