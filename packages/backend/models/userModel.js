
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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


// Mongoose middleware (also called Mongoose hooks) are functions that run automatically before or after certain actions in the Mongoose lifecycle
//  — like saving, validating, updating, deleting, etc.
// A Promise is a JavaScript object that represents a task that will finish in the future.
// Resolve → task finished successfully
// Reject → task failed

// hasing the passoword before saving into the database using mongoose middleware
userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next();
  }
  this.password=await bcrypt.hash(this.password,10);
  next();
})

userSchema.methods.getJWTToken=function (){
  return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRES_TIME || "7d"
  })
}

//verify password
userSchema.methods.verifyPassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
};

//generate token for reset password
userSchema.methods.generatePasswordResetToken=function(){
  const resetToken=crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire=Date.now()+15*60*1000;
  return resetToken;
}


const User = mongoose.model("User", userSchema);

export default User;
