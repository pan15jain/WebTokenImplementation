const express = require("express");
const model = require("../models/Users");
const { CreateAccessToken } = require("../token");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const fetchdata = await model.find();
    res.json(fetchdata);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const fetchdata = await model.findById(req.params.id);
    res.json(fetchdata);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const remarkModel = new model({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
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
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
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
