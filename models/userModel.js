const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  mobilenumber: {
    type: String,
    required: true,
  },
  dateofbirth: {
    type: Number,
  },
  address: {
    type: Array,
  },
  password: {
    type: String,
  },
  createddate: {
    type: Date,
  },
  updated: {
    type: Date,
  },
  image: {
    type: Array,
  },
  isBlocked: {
    type: Boolean,
  },
  isVerified: {
    type: Boolean,
  },
  totalcart: {
    type: Number,
  },
});

const userModal = mongoose.model("user", userSchema);
module.exports = userModal;
