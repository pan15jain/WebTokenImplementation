const express = require("express");
const bodyparser = require("body-parser");
const prevDate = require("./routes/prevDates");
const cases = require("./routes/cases");
const remarks = require("./routes/remarks");
const users = require("./routes/users");
const mongoose = require("mongoose");
const model = require("./models/Users");
const app = express();
require("dotenv").config();
const isAuth = require("./routes/isAuth");
const { verify } = require("jsonwebtoken");
const { CreateAccessToken } = require("./token");
const connectionstring = process.env.CONNECT_STRING;
mongoose.connect(connectionstring, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
//app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const fetchdata = await model.find();
    const user = fetchdata.find(
      (user) => user.username === username && user.password === password
    );
    //console.log(user.username);
    if (!user) throw new Error("Invalid user");
    const accessToken = CreateAccessToken(user._id);
    res.send({ accessToken: accessToken });
  } catch (err) {
    res.json({ message: err });
  }
});
app.use("/Users", users);
app.use(function (req, res, next) {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  const token = req.headers.authorization.split(" ")[1];
  const userid = verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!userid) throw Error("you need to log in");
  next();
});
app.use("/Cases", cases);
app.use("/PrevDates", prevDate);
app.use("/Remarks", remarks);
app.listen(process.env.PORT, () =>
  console.log(`listening at port ${process.env.PORT}`)
);
