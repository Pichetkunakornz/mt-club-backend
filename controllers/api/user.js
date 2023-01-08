const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");
//let userSchema = new Schema(require("../../models/users"));
//const User = mongoose.model("users", userSchema);
const User = require("../../models/users");
const secret = require("../../config/constant").secret;
const jwt = require("jsonwebtoken");

router
  .get("/", async (req, res, next) => {
    console.log("get /user");
    try {
      const data = await User.find({});
      return res.status(200).json({ status: "success", data: data });
    } catch (error) {
      console.log("err", error);
      return res.status(500).json({ status: "error", message: error.message });
    }
  })
  .post("/", async (req, res, next) => {
    try {
      let datacreate = { ...req.body };
      //check unique email
      const user = await User.findOne({
        email: datacreate.email,
      });
      if (user) {
        return res.status(500).json({
          status: "error",
          message: "อีเมลนี้มีผู้ใช้งานแล้ว",
        });
      }
      datacreate.password = hashPassword(datacreate.password);
      const data = await User.create(datacreate);
      return res.status(200).json({ data: data });
    } catch (error) {
      console.log("err", error);
      return res.status(500).json({ status: "error", message: error.message });
    }
  })
  .put("/:id", async (req, res, next) => {
    try {
      let dataUpdate = { ...req.body };
      let userId = req.params.id;
      console.log("dataUpdate", dataUpdate);
      const data = await User.findByIdAndUpdate(userId, dataUpdate, {
        new: true,
      });
      return res.status(200).json({ data: data });
    } catch (error) {
      console.log("err", error);
      return res.status(500).json({ status: "error", message: error.message });
    }
  })
  .post("/profile", async (req, res, next) => {
    try {
      return res.status(200).json({ user: req.user });
    } catch (error) {
      console.log("err", error);
      return res.status(500).json({ status: "error", message: error.message });
    }
  })
  //login
  .post("/login", async (req, res, next) => {
    let loginData = { ...req.body };
    console.log("loginData", loginData);
    // Find the user with the given email
    const user = await User.findOne({
      email: loginData.email,
    }).select("+password");
    // If the authentication was successful, generate a unique secret for the user and save it in the database
    console.log("user", user);
    if (!user) {
      // If the user with the given email doesn't exist, return an error message
      return res.status(401).json({ message: "ไม่พบอีเมลนี้ในระบบ" });
    }
    console.log("password", loginData.password);
    console.log("user password", user.password);
    // Check if the given password is correct
    // if (!bcrypt.compareSync(loginData.password, user.password)) {
    if (loginData.password != user.password) {
      // If the password is incorrect, return an error message
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    } else {
      // filter password before return
      user.password = undefined;
      const token = jwt.sign({ user: user }, secret);
      return res.json({
        token: token,
        user: user,
        message: "เข้าสู่ระบบสำเร็จ",
      });
    }
  });
function hashPassword(password) {
  // return bcrypt.hashSync(password, 10);
  return password;
}

module.exports = router;
