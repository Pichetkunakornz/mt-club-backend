const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "น้องชมรม",
  },
  prefix: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  lineId: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  major: {
    type: String,
  },
  collegeYear: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  emailVerifyAt: {
    type: Date,
  },
  token: {
    type: String,
  },
});

module.exports = model("User", userSchema);
