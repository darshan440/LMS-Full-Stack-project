import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddalWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // when wrong mongoDB ID err
  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Err
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, Try again`;
    err = new ErrorHandler(message, 401); // Set an appropriate status code
  }

  // JWT expire
  if (err.name === "TokenExpireError") {
    const message = `Json web token expired, Try again`;
    err = new ErrorHandler(message, 401); // Set an appropriate status code
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
