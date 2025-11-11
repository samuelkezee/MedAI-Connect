// Handles the logic for user-related requests
import { errorHandleMiddleware } from "../middleware/errors.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";

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

  // Send response
  res.status(201).json({
    success: true,
    message: "User registered successfully (placeholder)",
    user, // optional: include the user object in response
  });
});

// Placeholder for user login
export const loginUser = handleAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User logged in successfully (placeholder)",
  });
});
