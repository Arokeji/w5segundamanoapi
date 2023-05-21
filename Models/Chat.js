const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Product } = require("./Product.js");

const chatSchema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true
    },
    messages: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      }
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
