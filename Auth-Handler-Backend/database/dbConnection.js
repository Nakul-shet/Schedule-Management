import mongoose from "mongoose";

export const dbConnection = () => {

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  mongoose
    .connect(process.env.MONGO_URI , options)
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};
