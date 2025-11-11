// Handles the logic for user-related requests
import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import HandleError from "../utils/handleError.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Placeholder for user registration
export const registerUser = handleAsyncError(async (req, res, next) => {
  // Extract data from request body
  const { email, password, firstName, lastName } = req.body;

  // Create user object (placeholder)
  const user =await User.create({
    firstName,
    lastName,
    email,
    password,
    avatar: {
      public_id: "temp_id",
      url: "temp_url",
    },
  });
  sendToken(user,201,res)
});

// Placeholder for user login
export const loginUser = handleAsyncError(async (req, res, next) => {
  const{email,password}=req.body;

  if(!email || !password){
    return next(new HandleError("Please enter email and password",400));
  }
  const user=await User.findOne({email}).select("+password");
  if(!user){
    return next(new HandleError("Invalid email or password",401));
  }
  const isPasswordValid=await user.verifyPassword(password);
  if(!isPasswordValid){
    return next(new HandleError("Invalid email or password",401));
  }
  sendToken(user,200,res)
});
//logout
export const logoutUser=handleAsyncError(async(req,res,next)=>{
  res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true});
  res.status(200).json({
    success:true,
    message:"Logged out successfully"
  })
})
// Get User Details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id); // corrected: use _id

  res.status(200).json({
    success: true,
    user,
  });
});

//update password
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new HandleError("Please enter all fields", 400));
    }
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordValid = await user.verifyPassword(oldPassword);
    if (!isPasswordValid) {
        return next(new HandleError("Invalid old password", 401));
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("Password does not match", 400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
});


// Update user profile
export const updateProfile = handleAsyncError(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const newUserData = {
      firstName,
      lastName,
      email,
    };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
//Admin getting userlist
export const getAllUsers = handleAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Admin - getting single user info
export const getUserDetailsById = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin - changing user role
export const updateUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const NewUserData = { role };

  const user = await User.findByIdAndUpdate(req.params.id, NewUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
});
// Admin - deleting user
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});


//Forgot password
export const forgotPassword = handleAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new HandleError("User not found", 404));
    }
    // Get reset password token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new HandleError(error.message, 500));
    }
});

// Reset password
export const resetPassword = handleAsyncError(async (req, res, next) => {
    // Hash url token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new HandleError("Password reset token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new HandleError("Password does not match", 400));
    }

    // Set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});
