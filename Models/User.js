const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
          validator: validator.isEmail,
          message: "Email incorrecto",
    },
},
    password: { 
        type: String,
        trim: true,
        required: true,
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        select: false
  }, 
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
