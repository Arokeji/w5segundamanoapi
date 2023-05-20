const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Message } = require("./Message.js");
const { User } = require("./User.js");

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

const Messages = mongoose.model("Message", messageSchema);
module.exports = { Messages };
