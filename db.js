import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

/* NODE_ENV can be set on start in package.json */
const NODE_ENV = process.env.NODE_ENV;
const url =
  NODE_ENV === "production" ? process.env.DB_URL_PRD : process.env.DB_URL_DEV;

const openMongoConnection = async () => {
  try {
    mongoose.connect(url);
    console.log("** Connected to Mongo! **");
  } catch (error) {
    console.log("DB connection error: ", error);
  }
};

const closeMongoConnection = () => {
  try {
    mongoose.connection.close();
    console.log("** Disconnected from Mongo! **");
  } catch (error) {
    console.log("DB disconnection error: ", error);
  }
};

export { openMongoConnection, closeMongoConnection };
