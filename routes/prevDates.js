const model = require("../models/PrevDates");
const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectId;

router.get("/", async (req, res) => {
  try {
    const data = await model.find();
    res.json(data);
  } catch (err) {
    res.json({ msg: err });
  }
});
router.get("/:caseid", async (req, res) => {
  try {
    console.log("hello");
    console.log(req.params.caseid);
    const data = await model.find({ caseid: ObjectId(req.params.caseid) });
    res.json({ dateRecord: data });
  } catch (err) {
    res.json({ msg: err });
  }
});
router.post("/", async (req, res) => {
  const Model = new model({
    caseid: req.body.caseid,
    previousDate: req.body.previousDate,
    purpose: req.body.purpose,
  });
  try {
    const saveddata = await Model.save();
    res.json(saveddata);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedData = await model.findByIdAndDelete({ _id: req.params.id });
    res.json(deletedData);
  } catch (error) {
    res.json({ message: err });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const updatedData = await model.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          caseid: req.body.caseid,
          previousDate: req.body.previousDate,
          purpose: req.body.purpose,
        },
      }
    );
    res.json(updatedData);
  } catch (error) {
    res.json({ message: err });
  }
});

module.exports = router;
