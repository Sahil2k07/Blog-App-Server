import express from "express";
import { sendOtp, login, signup } from "../controllers/Auth";

const router = express.Router();

router.post("/user/sendotp", sendOtp);

router.post("/user/signup", signup);

router.post("/user/login", login);

export default router;
