const express = require("express");
const secret = require("../../config/constant").secret;
const jwt = require("jsonwebtoken");

module.exports.isAuthorized = function (req, res, next) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 401;
        return next(err);
      } else {
        return next();
      }
    }
  });
};
//middleware example

module.exports.authMiddleware = function (req, res, next) {
  // Get the JWT from the request header
  const token = req.headers["authorization"];
  console.log(req.headers);
  if (!token) {
    // If there is no JWT, return an error
    return res.status(401).json({ message: "No token provided." });
  }
  // Verify the JWT using the secret
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // If the JWT is invalid, return an error
      return res.status(401).json({ message: "Invalid token." });
    }
    // If the JWT is valid, set the user object in the request
    req.user = decoded.user;
    next();
  });
};
/*
// Use the auth middleware to protect routes
app.get('/protected', authMiddleware, (req, res) => {
  // The request is authenticated, you can return the protected data
  res.json({ data: 'protected data' });
});
*/
