import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token not found, Please Log In first.",
      });
    }

    try {
      if (!process.env.JWT_SECRET) {
        res.status(400).json({
          msg: "JWT_SECRET not found",
        });

        throw new Error("JWT_SECRET not found");
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      req.user = {
        email: decode.email,
        id: decode.id,
        approved: decode.approved,
      };
    } catch (err) {
      return res.json({
        success: false,
        msg: "Invalid Token",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Middleware Error.",
      error,
    });
  }
};
