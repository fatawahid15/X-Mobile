require('dotenv').config()
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; 

exports.signToken = (payload) => {
  return jwt.sign(payload, secret);
};

exports.verify = (token) => {
  return jwt.verify(token, secret);
};
