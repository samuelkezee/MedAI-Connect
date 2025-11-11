import mongoose from "mongoose";

export const connectDatabase = () => {
  // Return the promise
  return mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  });
};
