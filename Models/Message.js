const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./User.js");

const messageSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    emisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    receptor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Message", messageSchema);
module.exports = { Messages };
