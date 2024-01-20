import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true, // remove whitespace
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true, // remove whitespace
    },

    fullName: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true, // remove whitespace
      index: true,
    },

    avatar: {
      type: String, //cluodinary url
      required: [true, "Avatar is required"],
    },

    coverImage: {
      type: String, //cluodinary url
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },

  { timestamps: true }
);

// password hashing before saving to database

userSchema.pre("save", async function (next) {
  // if password is not modified, skip this middleware
  if (!this.isModified("password")) return next();
  // if password is modified, hash it
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate tokens

// generate access token
userSchema.methods.genereteAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// generate refresh token
userSchema.methods.genereteRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
