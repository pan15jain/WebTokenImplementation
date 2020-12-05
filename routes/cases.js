const express = require("express");
const router = express.Router();
const model = require("../models/Cases");
const isAuth = require("./isAuth");

router.get("/", async (req, res) => {
  try {
    const cases = await model.find();
    //console.log(cases);
    res.json({ CasesRecord: cases });
  } catch (error) {
    res.json({ message: error });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const cases = await model.findById(req.params.id);
    res.json(cases);
  } catch (error) {
    res.json({ message: error });
  }
});
router.post("/", async (req, res) => {
  //console.log(req.body);
  const casemodel = new model({
    id: req.body.id,
    fileNo: req.body.fileNo,
    caseNo: req.body.caseNo,
    applicantName: req.body.applicantName,
    deceasedName: req.body.deceasedName,
    address: req.body.address,
    distt: req.body.distt,
    phone: req.body.phone,
    previousDate: req.body.previousDate,
    previousPurpose: req.body.previousPurpose,
    nextDate: req.body.nextDate,
    nextPurpose: req.body.nextPurpose,
  });
  try {
    const dataSaved = await casemodel.save();
    //console.log(dataSaved);
    res.json(dataSaved);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecord = await model.findOneAndDelete({ _id: req.params.id });
    res.json(deletedRecord);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const record = await model.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          id: req.body.id,
          fileNo: req.body.fileNo,
          caseNo: req.body.caseNo,
          applicantName: req.body.applicantName,
          deceasedName: req.body.deceasedName,
          address: req.body.address,
          distt: req.body.distt,
          phone: req.body.phone,
          previousDate: req.body.previousDate,
          previousPurpose: req.body.previousPurpose,
          nextDate: req.body.nextDate,
          nextPurpose: req.body.nextPurpose,
        },
      }
    );
    res.json(record);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
