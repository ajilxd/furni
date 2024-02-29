mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
  },
  isProductBlocked: {
    type: Boolean,
    required: true,
  },
  categoryId: {
    type: Objectid,
    required: true,
    ref: "categories",
  },
  isCategoryBlocked: {
    type: Boolean,
    required: true,
  },
});

const productModel = new mongoose.model("products", productSchema);
module.exports = productModel;
