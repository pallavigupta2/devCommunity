const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 50,
      match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 18,
      max: 70,
    },
    gender: {
      type: String,
      enum:["male", "female", "others"]
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("enter valid gender!");
      //   }
      // },
    },
    aboutUs: {
      type: String,
      default: "Hi!, I am a Software Developer.",
    },
    photoUrl: {
      type: String,
      default:
        "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const userModal = mongoose.model("User", userSchema);
module.exports = userModal;
