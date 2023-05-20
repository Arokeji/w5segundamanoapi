const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Product } = require("./Product.js");
const { Message } = require("./Message.js");

const chatSchema = new Schema(
  {
    buyer: {
      type: String,
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Product,
    },
    messages: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Message,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
