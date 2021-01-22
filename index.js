const express = require("express");
const bodyparser = require("body-parser");
const remarks = require("./routes/remarks");
const app = express();
const cors = require("cors");
require("dotenv").config();
const isAuth = require("./routes/isAuth");
const { verify } = require("jsonwebtoken");
const { CreateAccessToken } = require("./token");

//console.log(process.env);
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.get("/initialToken", async (req, res) => {
  const accessToken = await CreateAccessToken(req.query.id);
  res.json({ accessToken: accessToken });
});
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const fetchdata = await model.find();
//     const user = fetchdata.find(
//       (user) => user.username === username && user.password === password
//     );
//     console.log(user === undefined);
//     if (user === undefined) throw new Error("Invalid user");
//     const accessToken = CreateAccessToken(user._id);
//     res.json({ accessToken: accessToken });
//   } catch (err) {
//     console.log(err);
//     res.json({ message: err });
//   }
// });
function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}
app.use(function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(403).json({ error: "token not defined" });
  //const userid = verify(token, process.env.ACCESS_TOKEN_SECRET);

  verify(token, process.env.ACCESS_TOKEN_SECRET, "", (jsonerr, data) => {
    if (jsonerr) {
      return res
        .status(403)
        .json({ error: jsonerr.name, description: jsonerr.message });
    }
  });
  next();
});

app.use("/Remarks", remarks);

app.listen(process.env.PORT, () =>
  console.log(`listening at port ${process.env.PORT}`)
);
