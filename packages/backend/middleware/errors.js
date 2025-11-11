import HandleError from "../utils/handleError.js";

export const errorHandleMiddleware = (err, req, res, next) => {
  err.statusCode=err.statusCode||500;
  err.message=err.message||"internal server error"

  if(err.name=="castError"){
    const message=`This is invalid resource ${err.path}`
    err = new HandleError(message, 404);
  }

  if(err.code===1100){
    const message=`Duplicate ${Object.keys(err.keyValue)} entered`
    err=new HandleError(message,400)
  }
res.status(err.statusCode).json({
  success:false,
  message:err.message
})
};