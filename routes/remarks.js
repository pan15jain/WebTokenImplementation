const express = require("express");
const router = express.Router();
const data = require("../Data/remarksdata");

router.get("/", async (req, res) => {
  try {
    console.log("hello");
    const fetchdata = await data; //await model.find();
    res.json(fetchdata);
  } catch (err) {
    res.json({ message: err });
  }
});
router.post("/", async (req, res) => {
  try {
    const maxId = data.reduce(
      (max, remark) => (remark.id > max ? remark.id : max),
      data[0].id
    );
    const newid = maxId + 1;
    data.push({
      id: newid,
      remarkDate: req.body.remarkDate,
      note: req.body.note,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const index = data.findIndex((x) => x.id === parseInt(req.params.id));
    data[index].remarkDate = req.body.remarkDate;
    data[index].note = req.body.note;
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const dataafterdelete = data.filter(
      (x) => x.id !== parseInt(req.params.id)
    );
    res.json(dataafterdelete);
  } catch (err) {
    res.json({ message: err });
  }
});
module.exports = router;
