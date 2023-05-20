const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./User.js");

const productSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pictures: {
      type: String
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
