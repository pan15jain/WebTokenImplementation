const { sign } = require("jsonwebtoken");

const CreateAccessToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const CreateRefreshToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const SendAccessToken = (req, res, accesstoken) => {
  res.send({
    accesstoken,
  });
};

const SendRefreshToken = (req, res, refreshtoken) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

module.exports = {
  CreateAccessToken,
  CreateRefreshToken,
  SendAccessToken,
  SendRefreshToken,
};
