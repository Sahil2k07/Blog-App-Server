import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.log("DB URL not found");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);

    process.exit(1);
  }
};
