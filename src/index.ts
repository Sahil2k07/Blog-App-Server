import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from "./config/mongoose";
import userRoutes from "./routes/User";
import blogRoutes from "./routes/Blog";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

dbConnect();

app.use("/api/v1", userRoutes);
app.use("/api/v1", blogRoutes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
