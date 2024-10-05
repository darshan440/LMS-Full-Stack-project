import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { creatCourse, getAllCoursesService } from "../services/couese.services";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";
import mongoose from "mongoose";

// Upload Course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      await creatCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit Course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;
      const thumbnail = data.thumbnail;
      const courseContent = (await CourseModel.findById(courseId)) as any;

      if (thumbnail && !thumbnail.startsWith("https")) {
        // Delete the existing thumbnail from Cloudinary if provided
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseContent?.thumbnail.public_id,
          url: courseContent?.thumbnail.url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get Single Course (without purchasing)
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const cachedCourse = await redis.get(courseId);

      if (cachedCourse) {
        const course = JSON.parse(cachedCourse);
        return res.status(200).json({ success: true, course });
      }

      const course = await CourseModel.findById(courseId).select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // Cache for 7 days
      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get All Courses
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
      res.status(200).json({ success: true, courses });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get Course Content (for premium users)
export const getContent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const userCourses = req.user?.courses;

      const courseExists = userCourses?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible for this content", 404)
        );
      }

      const course = await CourseModel.findById(courseId);
      const content = course?.courseContent;

      res.status(200).json({ success: true, content });
    } catch (error: any) {
      return next(
        new ErrorHandler("Something went wrong: " + error.message, 500)
      );
    }
  }
);

// Add Question
export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body;

      // Find course by courseId
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Validate contentId and find course content
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      const courseContent = course.courseContent.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent || typeof courseContent !== "object") {
        return next(new ErrorHandler("Invalid course content", 400));
      }

      // Create a new question based on the IComment interface
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [], // Initially, there are no replies
      };

      // Add the question to the course content's questions array
      courseContent.questions.push(newQuestion);

      // Create a notification for the new question
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${courseContent.title}`,
      });

      // Save the course document with the new question
      await course.save();

      res.status(200).json({
        success: true,
        message: "Question added successfully",
        course,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Something went wrong: " + error.message, 500)
      );
    }
  }
);

// Add Answer
export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId } = req.body;

      // Find course by courseId
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Validate contentId and find course content
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      const courseContent = course.courseContent.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent || typeof courseContent !== "object") {
        return next(new ErrorHandler("Invalid course content", 400));
      }

      // Find the specific question by questionId
      const question = courseContent.questions.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid question Id", 400));
      }

      // Create a new answer as an IComment (answers can have replies too)
      const newAnswer: any = {
        user: req.user,
        question: answer, // In this case, the answer is stored as 'question' for consistency
        questionReplies: [], // Initially no replies to the answer
      };

      // Push the new answer into the question's replies array
      question.questionReplies?.push(newAnswer);

      // Save the updated course document with the new answer
      await course.save();

      res.status(200).json({
        success: true,
        message: "Answer added successfully",
        course,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Something went wrong: " + error.message, 500)
      );
    }
  }
);

export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.messege, 404));
    }
  }
);

// Delete Course
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne();
      await redis.del(id);

      res
        .status(200)
        .json({ success: true, message: "Course deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Generate Video URL
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      if (!videoId) {
        return res.status(400).json({ message: "Video ID is required" });
      }

      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/a1f5c3b46e59f99d4fbb6bcb2003568a/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler("VdoCipher error: " + error.message, 400));
    }
  }
);
