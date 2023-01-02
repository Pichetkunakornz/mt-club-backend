const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

module.exports = {
  eventType: {
    type: String,
  },
  eventName: {
    type: String,
  },
  eventDateStart: {
    type: Date,
  },
  eventDateEnd: {
    type: Date,
  },
  eventLocation: {
    type: String,
  },
  eventProvince: {
    type: String,
  },
  eventStatus: {
    type: String,
  },
  eventDescription: {
    type: String,
  },
  eventUniversity: {
    type: String,
  },
  eventImage: {
    cover: { type: Schema.Types.ObjectId },
    other: {
      type: Array,
    },
  },
  eventManager: {
    type: String,
  },
  participantLimit: {
    type: Number,
  },
  participant: [
    {
      userId: { type: String },
      message: {
        type: Object,
      },
      status: {
        type: String,
      },
      account: {
        name: {
          type: String,
        },
        number: {
          type: String,
        },
        bank: {
          type: String,
        },
      },
      slipPhoto: {
        type: String,
      },
      paymentStatus: {
        type: String,
      },
      slipUploadDate: {
        type: Date,
      },
      createDate: {
        type: Date,
      },
    },
  ],
  eventTransport: {
    type: String,
  },
  specialEvent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
};
