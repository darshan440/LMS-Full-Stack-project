import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOption {
  expire: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

export const acceptTokenOptions: ITokenOption = {
  expire: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOption: ITokenOption = {
  expire: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Store user session in Redis
  redis.set(user._id, JSON.stringify(user) as any);

  // Set secure flag for cookies in production
  if (process.env.NODE_ENV === "production") {
    acceptTokenOptions.secure = true;
  }

  // Set cookies in the response
  res.cookie("access_token", accessToken, acceptTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOption);

  // Send response
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
