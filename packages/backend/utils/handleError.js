export default class HandleError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// In a web application, especially in the backend, not all errors are the same. Some are programming mistakes (like a typo), while others are expected conditions (like a user trying to access something without permission).
// This HandleError class creates a new, more specific type of error. Instead of just having a generic error with a message, you now have an error that also carries a statusCode.
//  This is standard practice in backend development for clearly signaling what kind of error occurred (e.g., 404 Not Found, 401 Unauthorized, 400 Bad Request).
// When you call new HandleError("User not found", 404),
// throw new Error("Something went wrong");
// You automatically get:
// a .message property ("Something went wrong")
// a .stack property (shows where the error happened in your code)
// JavaScript passes "User not found" and 404 into the constructor.and when using super(message) calls the parent class (Error) constructor and gives it "User not found".
//Step 4. Add your own property
// After super(message) finishes, your constructor adds:
// this.statusCode = statusCode; // i.e. 404
