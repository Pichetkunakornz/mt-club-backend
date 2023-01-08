const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new Schema(require("../../models/events"));
const Event = mongoose.model("events", EventSchema);
// const userSchema = new Schema(require("../../models/users"));
// const User = mongoose.model("users");
const User = require("../../models/users");
var auth = require("./auth");

router
  .get("/", auth.authMiddleware, async (req, res, next) => {
    try {
      let query = req.query ? req.query : {};
      //check role if != ผู้ประสานงาน ให้กรองตาม university
      let user = req.user;
      if (user.role != "ผู้ประสานงาน") {
        query.eventUniversity = user.university;
        query.eventStatus = "เปิดรับสมัคร";
      }
      const data = await Event.find(query);
      return res.status(200).send({ status: "success", data: data });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .get("/:id", async (req, res, next) => {
    console.log("get /event");
    try {
      let _id = req.params.id;
      const data = await Event.findById(_id);
      console.log("data", JSON.stringify(data));
      return res.status(200).send({ status: "success", data: data });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .get("/:id/participant", auth.authMiddleware, async (req, res, next) => {
    console.log("get /event/participant");
    try {
      let _id = req.params.id;
      const data = await Event.findById(_id);
      const user = req.user;
      let userList = [];
      data.participant.forEach((element) => {
        if (element.status != "ยกเลิก") userList.push(element.userId);
      });
      let participant = [];
      console.log(await userList);
      if (user.role != "ผู้ประสานงาน") {
        participant = await User.find(
          {
            _id: { $in: userList },
          },
          {
            firstName: 1,
            lastName: 1,
            nickName: 1,
            collegeYear: 1,
          }
        );
      } else {
        participant = await User.find(
          {
            _id: { $in: userList },
          },
          {
            firstName: 1,
            lastName: 1,
            nickName: 1,
            collegeYear: 1,
            phoneNumber: 1,
            lineId: 1,
          }
        );
      }
      // map data.participant.*.status to participant.*.status
      participant = participant.map((user) => {
        let participant = data.participant.find(
          (participant) => participant.userId == user._id
        );
        return { ...user._doc, status: participant.status };
      });
      return res.status(200).send({ status: "success", data: participant });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .put("/:id", async (req, res, next) => {
    console.log("put /event/:id");
    try {
      let body = req.body;
      let eventId = req.params.id;
      console.log("eventId", eventId);
      console.log("body", body);

      dataupdated = await Event.findByIdAndUpdate(
        eventId,
        { ...body, updatedAt: new Date() },
        { new: true }
      );
      return res.status(200).send({ status: "success", data: dataupdated });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .put("/:id/user", auth.authMiddleware, async (req, res, next) => {
    console.log("put /event/:id/user");
    try {
      let body = req.body;
      let eventId = req.params.id;
      let userid = req.user._id;
      console.log("userid", userid);
      let conditions = {
        _id: eventId,
        "participant.userId": userid,
      };

      let updateSet = {};
      // { "participant.$[elem].status": body.status }
      let updateAdd = {
        participant: {
          userId: userid,
          // "status": body.status
        },
      };
      if (body.status) {
        updateAdd["participant"]["status"] = body.status;
        updateSet["participant.$[elem].status"] = body.status;
      }
      if (body.message) {
        updateAdd["participant"]["message"] = body.message;
        console.log(typeof body.message);
        if (typeof body.message == "object") {
          for (const key in body.message) {
            updateSet[`participant.$[elem].message.${key}`] = body.message[key];
          }
        }
      }
      let hasDoc = await Event.findOne(conditions);
      let dataupdated;
      if (hasDoc) {
        dataupdated = await Event.findOneAndUpdate(
          conditions,
          { $set: updateSet },
          {
            arrayFilters: [{ "elem.userId": userid }],
            upsert: true,
            new: true,
          }
        );
      } else {
        console.log("else");
        dataupdated = await Event.findByIdAndUpdate(
          eventId,
          { $addToSet: updateAdd },
          {
            new: true,
          }
        );
      }
      return res.status(200).send({ status: "success", data: dataupdated });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .put("/:id/participant", auth.authMiddleware, async (req, res, next) => {
    try {
      let body = req.body;
      let eventId = req.params.id;
      let userid = req.userId;
      let user = req.user;
      console.log("userid", userid);
      if (user.role != "ผู้ประสานงาน")
        return res.status(401).send({
          status: "error",
          message: "สิทธิ์การใช้งานของท่าน ไม่สามารถดำเนินการได้",
        });
      let conditions = {
        _id: eventId,
        "participant.userId": userid,
      };

      let updateSet = {};
      // { "participant.$[elem].status": body.status }
      let updateAdd = {
        participant: {
          userId: userid,
        },
      };
      if (body.status) {
        updateAdd["participant"]["status"] = body.status;
        updateSet["participant.$[elem].status"] = body.status;
      }
      if (body.message) {
        updateAdd["participant"]["message"] = body.message;
        console.log(typeof body.message);
        if (typeof body.message == "object") {
          for (const key in body.message) {
            updateSet[`participant.$[elem].message.${key}`] = body.message[key];
          }
        }
      }
      let hasDoc = await Event.findOne(conditions);
      let dataupdated;
      if (hasDoc) {
        dataupdated = await Event.findOneAndUpdate(
          conditions,
          { $set: updateSet },
          {
            arrayFilters: [{ "elem.userId": userid }],
            upsert: true,
            new: true,
          }
        );
      } else {
        console.log("else");
        dataupdated = await Event.findByIdAndUpdate(
          eventId,
          { $addToSet: updateAdd },
          {
            new: true,
          }
        );
      }
      return res.status(200).send({ status: "success", data: dataupdated });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send({ status: "error", message: error.message });
    }
  })

  .post("/", async (req, res, next) => {
    let datacreate = { ...req.body };
    const eventCreated = await Event.create(datacreate);
    return res.json({ data: eventCreated });
  });

module.exports = router;
