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
  try {
    const dataSaved = savemodel.save();
    res.json(dataSaved);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
        },
      }
    );
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
