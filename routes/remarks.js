const express = require("express");
const model = require("../models/Remarks");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("hello");
    const fetchdata = await model.find();
    res.json(fetchdata);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:caseid", async (req, res) => {
  try {
    console.log(req.params.caseid);
    const fetchdata = await model.find({ caseId: req.params.caseid });
    console.log(fetchdata);
    res.json(fetchdata);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const remarkModel = new model({
    caseId: req.body.caseId,
    remarkDate: req.body.remarkDate,
    note: req.body.note,
  });
  try {
    const savedDate = await remarkModel.save();
    res.json(savedDate);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updateData = await model.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          caseId: req.body.caseId,
          remarkDate: req.body.remarkDate,
          note: req.body.note,
        },
      }
    );
    res.json(updateData);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleteddata = await model.findByIdAndDelete(req.params.id);
    res.json(deleteddata);
  } catch (err) {
    res.json({ message: err });
  }
});
module.exports = router;
