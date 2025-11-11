
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    maxLength: [25, "Your first name cannot exceed 25 characters"],
    minLength: [3, "Your first name must be at least 3 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    maxLength: [25, "Your last name cannot exceed 25 characters"],
    minLength: [3, "Your last name must be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Your password must be at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
