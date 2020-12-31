const express = require("express");
const bodyparser = require("body-parser");
const prevDate = require("./routes/prevDates");
const cases = require("./routes/cases");
const remarks = require("./routes/remarks");
const todo = require("./routes/todos");
const users = require("./routes/users");
const casemodel = require("./models/Cases");
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
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.get("/initialToken", async (req, res) => {
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
app.use("/Cases", cases);
app.use("/PrevDates", prevDate);
app.use("/Remarks", remarks);
app.use("/Todo", todo);

app.get("/GetDashboard", (req, res) => {
  var dashboard = {
    monthNames: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    pieChart: {
      labels: [],
      datasets: [],
    },
    barChart: {
      labels: [],
      datasets: [],
    },
    todaysCases: 0,
    totalCases: 0,
  };
  var dashboard1 = {
    todoData: {},
    todaysTodo: 0,
  };

  var data = [];
  let promise1 = new Promise((resolve, reject) => {
    casemodel
      .aggregate([
        {
          $match: {
            nextDate: { $gte: new Date() },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$nextDate",
              },
              month: {
                $month: "$nextDate",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $limit: 6,
        },
      ])
      .then((result) => {
        result.map((prop, key) => {
          dashboard.barChart.labels.push(
            dashboard.monthNames[prop._id.month - 1]
          );
          dashboard.barChart.datasets.push(prop.count);
        });
        resolve();
      });
  });
  promise1.catch(function (err) {
    throw err;
  });

  let promise2 = new Promise((resolve, reject) => {
    casemodel
      .aggregate([
        {
          $match: {
            nextDate: { $lte: new Date() },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$nextDate",
              },
              month: {
                $month: "$nextDate",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.month": -1,
          },
        },
        {
          $limit: 6,
        },
      ])
      .then((result) => {
        result.map((prop, key) => {
          dashboard.pieChart.labels.push(
            dashboard.monthNames[prop._id.month - 1]
          );
          dashboard.pieChart.datasets.push(prop.count);
        });
        resolve();
      });
  });
  promise2.catch(function (err) {
    throw err;
  });
  let promise3 = new Promise((resolve, reject) => {
    var date = new Date();
    date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    casemodel
      .find({ nextDate: new Date(date) })
      .count()
      .then(function (numItems) {
        dashboard.todaysCases = numItems;
        resolve();
      });
  });
  promise3.catch(function (err) {
    throw err;
  });
  let promise4 = new Promise((resolve, reject) => {
    var date = new Date();
    date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    todo
      .find({ duedate: new Date(date) })
      .count()
      .then(function (numItems) {
        dashboard1.todaysTodo = numItems;
        resolve();
      });
    console.log(new Date(date));
  });

  let promise5 = new Promise((resolve, reject) => {
    casemodel
      .find()
      .count()
      .then(function (numItems) {
        dashboard.totalCases = numItems;
        resolve();
      });
  });
  //Promise for upcoming todos
  let promise6 = new Promise((resolve, reject) => {
    var date = new Date();
    date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    var datelimit = new Date();
    datelimit.setDate(datelimit.getDate() + 5);

    // var datelimit = new Date();
    datelimit =
      datelimit.getFullYear() +
      "-" +
      (datelimit.getMonth() + 1) +
      "-" +
      datelimit.getDate();

    todo

      .aggregate([
        {
          $match: {
            duedate: { $gte: new Date(date), $lte: new Date(datelimit) },
          },
        },

        {
          $sort: {
            duedate: 1,
          },
        },
      ])
      .toArray(function (err, result) {
        if (err) throw err;

        dashboard1.todoData = result;

        resolve();
      });
  });
  Promise.all([
    promise1,
    promise2,
    promise3,
    promise4,
    promise5,
    promise6,
  ]).then((result) => {
    res.send({ CasesRecord: dashboard, TodoDetails: dashboard1 });
  });
});
app.listen(process.env.PORT, () =>
  console.log(`listening at port ${process.env.PORT}`)
);
