require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import express from "express";
export const app = express();
import cors from "cors";
import cookieparser from "cookie-parser";

import { ErrorMiddalWare } from "./middalware/error";
import userRouter from "./routes/user.routs";
import courseRouter from "./routes/course.routs";
import orderRouter from "./routes/order.rourts";
import notifactionRouter from "./routes/notification.routs";
import analyticsRouter from "./routes/analytics.routs";
import layoutRouts from "./routes/layout.routs";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieparser());

// cors =  cross origin resource sharing
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true
  })
);
// routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notifactionRouter,
  analyticsRouter,
  layoutRouts
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Api is Working!!!",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl}not found`) as any;
  err.statusCode = 404;
  next(err);
});
app.use(ErrorMiddalWare);
