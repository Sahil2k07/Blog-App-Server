import { Request } from "express"; // Make sure to import the appropriate Request type

declare global {
  namespace Express {
    interface Request {
      user: {
        email: string;
        id: string;
        approved: boolean;
      };
    }
  }
}
