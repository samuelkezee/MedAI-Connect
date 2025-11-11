import handleAsyncError from "./handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const userAuthentication=handleAsyncError(async(req,res,next)=>{
    const{token}=req.cookies;

    if(!token){
        return next(new HandleError("Authentication is missing,Please login to access this resource",401))
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decoded.id);
    next();

})

//Role based access 
export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new HandleError(
            `Role- ${req.user.role} is not allowed to access the resource`,
            403
          )
        );
      }
      next();
    };
  };
  


// In Express, a middleware is a function that sits between the request (req) and the response (res).
// It can:
// Modify the request or response,
// Check permissions,
// Stop the request (by sending an error or response),
// Or allow it to continue to the next function using next().
