const express = require("express");
const api = new express.Router();
const userRoute = require("./user");
const eventRoute = require("./event");
api.use("/user", userRoute);
api.use("/event", eventRoute);

module.exports = api;
