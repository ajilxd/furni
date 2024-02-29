const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const otpSchema = new mongoose.Schema({
  userId: {
    type: Objectid,
  },
  otp: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
});

const otpModal = mongoose.model("otp", otpSchema);
module.exports = otpModal;
