const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Product } = require("./Product.js");
const { User } = require("./Product.js");
const { Message } = require("./Message.js");

const chatSchema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
    },
    messages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Message,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
