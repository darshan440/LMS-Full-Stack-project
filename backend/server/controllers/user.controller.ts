require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { Interface } from "readline";
import { error } from "console";
import {
  acceptTokenOptions,
  refreshTokenOption,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { exitCode } from "process";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.services";
import { StringExpressionOperatorReturningBoolean } from "mongoose";
import cloudinary from "cloudinary";
import { triggerAsyncId } from "async_hooks";
import CourseModel from "../models/course.model";
import { resolve } from "path/posix";

// registerUser
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      //   IN CASE EMAIL ALREADY EXIST
      const IsEmailExist = await userModel.findOne({ email });
      if (IsEmailExist) {
        return next(new ErrorHandler("This Email has already an account", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationTokenUser(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation.mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation.mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `We’ll send an OTP to sign in to your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// CREAT TOKEN
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationTokenUser = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// user activation
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activatUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }

      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(
          new ErrorHandler("This email is alredy created account", 400)
        );
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Ensure email and password are provided
      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email and password", 400)
        );
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      // Corrected placement of sendToken function call
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = req.user?._id || "";
      redis.del(userId);

      res.status(200).json({
        success: true,
        messege: "Logged out succesfuly",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// refresh token ---------------------------------------------------------------------------------------------------------------------------->/

export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      // Check if the refresh token is valid and decoded
      if (!decoded) {
        return next(new ErrorHandler("Failed to refresh token", 400));
      }

      // Retrieve user session from Redis
      const session = await redis.get(decoded.id as string);

      // Check if user session is available
      if (!session) {
        return next(new ErrorHandler("Plese Login To Access This Resources!", 400));
      }

      // Parse user session
      const user = JSON.parse(session);

      // Generate new access token
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );

      // Generate new refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d" }
      );

      // Set user in request object
      req.user = user;

      // Set new access and refresh tokens in response cookies
      res.cookie("access_token", accessToken, acceptTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOption);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); //7 days in sec

      // Respond with success status and new access token
      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Middleware
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user is authenticated and retrieve user ID
      const userId = req.user?._id;

      // Pass user ID to getUserById function
      await getUserById(userId, res);
    } catch (error: any) {
      // Handle any errors
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// get social auth
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// ------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User ID is missing", 400));
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (email) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist && isEmailExist._id.toString() !== userId) {
          return next(new ErrorHandler("Email is already taken", 400));
        }
        user.email = email;
      }

      if (name) {
        user.name = name;
      }

      await user.save();

      // Update Redis if available

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "User information updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update password -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Plese enter Old and New Password", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("User undefined", 400));
      }
      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();
      await redis.set(req.user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// update password -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;

      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatar",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatar",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }

        await user.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
          success: true,
          user,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// add review in course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}
export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExist = userCourseList?.some((course: any) => {
        return course._id.toString() === courseId.toString();
      });

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible  to access this course", 400)
        );
      }
      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body;
      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.review.push(reviewData);

      let avg = 0;

      course?.review.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.rating = avg / course.review.length;
      }

      await course?.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has gevin review in course${course?.name}`,
      };

      // create notification

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//add reply in review
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("course not found", 404));
      }
      const review = course.review.find(
        (rev: any) => rev._id.toString() === reviewId.toString()
      );

      if (!review) {
        return next(new ErrorHandler("review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {}
  }
);
// get all user - only for admin
export const getAllUsers = CatchAsyncError(async (req: Request, res: Response, next:NextFunction
) => {
  
  try {
    getAllUsersService(res);
  } catch (error :any) {
    return next(new ErrorHandler(error.messege, 404))
  }
})

// update role of user --------------------------------------------------------------------------------------------------------------------

export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = req.body;
    updateUserRoleService(res, id, role);
  } catch (error :any) {
    
  }
})

// delete user ---------------------------------------------------------------------------------------------------------------------

export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = userModel.findById(id);

    if (!user) {
      return next(new ErrorHandler("User Not Found!", 404));
    }
    await user.deleteOne();
    
    await redis.del(id);

    res.status(200).json({
      success: true,
      messege: "User Deleted Successfully",

    })
  } catch (error:any) {
    return next(new ErrorHandler(error.messege, 400));
  }
})