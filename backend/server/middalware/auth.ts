import { NextFunction, Request, Response, } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import { error } from "console";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { json } from "stream/consumers";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string ;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    try {
      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;

      const user = await redis.get(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      req.user = JSON.parse(user);

      next();
    } catch (error) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }
  }
);


// validate user role _// admin ke siva koi nahi kar pae is liye    
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler(`Role:${req.user?.role } is not allowed to access this resource`,403));
        }
        next()
    }
}