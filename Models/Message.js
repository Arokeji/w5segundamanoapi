const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Message } = require("./Message.js");
const { Message } = require("./Message.js");

const messageSchema = new Schema(
  {
    date: {
      type: Number,
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Message,
    },
    emisor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    receptor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = { Message };
