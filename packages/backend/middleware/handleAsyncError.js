// This is called a higher-order function —
// meaning: it’s a function that returns another function.in Express middleware or route handler has this signature:
// next → a function you call when you’re done or when an error happens


export default (myErrFun)=>(req,res,next)=>{
  Promise.resolve(myErrFun(req,res,next)).catch(next);
};






// Normally, Express only catches synchronous errors — not async ones.
// It wraps async route handlers in a Promise and makes sure any errors are caught and sent to next().
// If this throws an error, .catch(next) catches it and calls: