const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;

const addressSchema = new mongoose.Schema({
  userid: {
    type: Objectid,
    ref: "users",
  },
  name: {
    type: String,
  },
  typeofaddress: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  pincode: {
    type: String,
  },
  mobileno: {
    type: String,
  },
  landmark: {
    type: String,
  },
});

const addressModel = new mongoose.model("address", addressSchema);
module.exports = addressModel;
