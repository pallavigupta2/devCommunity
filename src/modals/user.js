const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isAlpha(value)){
          throw new Error("Enter alphabets only.");
          
        }
      }
    },
    lastName: {
      type: String,
      validate(value){
        if(!validator.isAlpha(value)){
          throw new Error("Enter alphabets only.");
          
        }
      }
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 50,
      //match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Valid Password : " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 70,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("enter valid gender!");
      //   }
      // },
    },
    aboutUs: {
      type: String,
      default: "Hi!, I am a Software Developer.",
      maxLength:200,
    },
    photoUrl: {
      type: String,
      default:
        "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url : " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "devCommunity@123", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};
const userModal = mongoose.model("User", userSchema);
module.exports = userModal;
