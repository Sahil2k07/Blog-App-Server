import type { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Otp from "../models/Otp";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { mailSender } from "../config/nodemailer";
import { otpTemplate } from "../mails/authMail";

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email({ message: "Invalid Email" }),
    });

    const { email } = req.body;

    if (!email) {
      return res.status(404).json({
        msg: "Email not found",
      });
    }

    try {
      schema.parse(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: "Valiation Error",
        error,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await Otp.deleteMany({ email });

    const otpSave = await Otp.create({
      otp,
      email,
    });

    await mailSender(
      email,
      "Verification Email From Blog-App with Auth",
      otpTemplate(otp)
    );

    return res.status(200).json({
      success: true,
      msg: "OTP sent successfully",
      data: otpSave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal Server error",
      error,
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password) {
      return res.status(404).json({
        success: false,
        msg: "All fields are required",
      });
    }

    const schema = z.object({
      name: z.string().trim(),
      email: z.string().trim().email({ message: "Invalid Email" }),
      password: z.string().trim(),
      otp: z.string().trim(),
    });

    try {
      schema.parse(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: "Validation Error",
        error,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email, please generate the otp again",
      });
    } else if (otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      msg: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error, Cannot SignUp.",
      error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().trim().email({ message: "Invalid Email" }),
      password: z.string().trim(),
    });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        msg: "All fields are required",
      });
    }

    try {
      schema.parse(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: "Validation Error",
        error,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User does not exists. Please Sign Up with Blog-App",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      if (!process.env.JWT_SECRET) {
        return res.status(404).json({
          success: false,
          msg: "Cannot login, Secret not found.",
        });
      }
      const token = jwt.sign(
        { email: user.email, id: user._id, approved: true },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        msg: "User Logged In",
        user,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Incorrect Password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server Error, Cannot Login.",
      error,
    });
  }
};
