const { verify } = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  console.log("1");
  console.log(req.headers[authorization]);
  const authorization = req.headers[authorization];
  if (!authorization) throw Error("you need to log in");
  const token = authorization.split(" ")[1];
  const userid = verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!userid) throw Error("you need to log in");
  next();
};

module.exports = isAuth;
