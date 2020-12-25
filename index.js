const express = require("express");
const bodyparser = require("body-parser");
const prevDate = require("./routes/prevDates");
const cases = require("./routes/cases");
const remarks = require("./routes/remarks");
const todo = require("./routes/todos");
const users = require("./routes/users");
const mongoose = require("mongoose");
const model = require("./models/Users");
const app = express();
const cors = require("cors");
require("dotenv").config();
const isAuth = require("./routes/isAuth");
const { verify } = require("jsonwebtoken");
const { CreateAccessToken } = require("./token");
const connectionstring = process.env.CONNECT_STRING;
mongoose.connect(connectionstring, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
app.use(cors());
//app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.get("/initialToken", async (req, res) => {
  //console.log(req.query.id);
  const accessToken = await CreateAccessToken(req.query.id);
  res.json({ accessToken: accessToken });
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const fetchdata = await model.find();
    const user = fetchdata.find(
      (user) => user.username === username && user.password === password
    );
    console.log(user === undefined);
    if (user === undefined) throw new Error("Invalid user");
    const accessToken = CreateAccessToken(user._id);
    res.json({ accessToken: accessToken });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});
app.use("/Users", users);
app.use(function (req, res, next) {  
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  const token = req.headers.authorization.split(" ")[1];
  const userid = verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!userid) return res.status(403).json({ error: "token Expired!" });  
  next();
});
app.use("/Cases", cases);
app.use("/PrevDates", prevDate);
app.use("/Remarks", remarks);
app.use("/Todo", todo);
app.listen(process.env.PORT, () =>
  console.log(`listening at port ${process.env.PORT}`)
);
