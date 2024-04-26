import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { creatCourse, getAllCoursesService } from "../services/couese.services";
import CourseModel, { ICourse } from "../models/course.model";
import { request } from "http";
import { redis } from "../utils/redis";
import { AsyncLocalStorage } from "async_hooks";
import { NetConnectOpts } from "net";
import mongoose, { Error } from "mongoose";
import { captureRejectionSymbol } from "events";
import { GeoReplyWith } from "redis";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

// upload course >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail; // Assuming thumbnail is an object with a 'url' property
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      creatCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      // Delete the existing thumbnail from Cloudinary if thumbnail is provided
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // Update the course in the database
      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      // Check if the course was updated successfully
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Respond with the updated course
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single course - without purchesing --------------------------------------------------------------------------------------------------------------------------
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //  -----------------------
      const courseId = req.params.id;
      const IsCacheExist = await redis.get(courseId);
      // ------------------------
      if (IsCacheExist) {
        const course = JSON.parse(IsCacheExist);

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set(courseId, JSON.stringify(course),"EX",604800);  // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
      // ---------------------
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// getAllCourses -----------------------------------------------------------------------------------------------------------------------------------------------
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //  -----------------------
      const courseId = req.params.id;
      const IsCacheExist = await redis.get(courseId);
      // ------------------------
      if (IsCacheExist) {
        const course = JSON.parse(IsCacheExist);

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
      // ---------------------
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get contant - only premium user -------------------------------------------------------------------------------------------------------------------------

export const getContent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const IsCourseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!IsCourseExist) {
        return next(
          new ErrorHandler("you are not eligilble for this contant", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.coursedata;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("somthing Went Wrong" + "->" + error.message, 500)
      );
    }
  }
);

// comment ------------------------------------------------------------------------------------------------------------------------------------------
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      const courseContent = course?.coursedata.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent || typeof courseContent !== "object") {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      // Ensure courseContent is not undefined before accessing its properties
      if (!courseContent._id || !Array.isArray(courseContent.questions)) {
        return next(new ErrorHandler("Invalid course content", 400));
      }

      // Create question model
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };



      // Add this question to our course content
      courseContent.questions.push(newQuestion);

         await NotificationModel.create({
           user: req.user?._id,
           title: "New Question recevied",
           message: `You have a new Question in  ${courseContent.titel}`,
         });

      // Save the changes
      await course.save();

      res.status(200).json({
        success: true,
        message: "Question added successfully",
        course,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Something went wrong" + "->" + error.message, 500)
      );
    }
  }
);

// reply to question -------------------------------------------------------------------------------------------------------------------------------------------------------------

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid contentId", 400));
      }

      const courseContent = course?.coursedata.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid contentId", 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid questionId", 400));
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };
       if (!question.questionReplies) {
         question.questionReplies = []; // Initialize questionReplies if it's undefined
       }

       question.questionReplies.push(newAnswer); 

      await course?.save();

      if (req.user?._id === question.user._id) {
        await NotificationModel.create({
          user: req.user?._id,
          title: "user replyd on you Question",
          message: `You have a new replys in  ${courseContent.titel}`,
        });

      } else {
        const data = {
          name: question.user.name,
          title: courseContent.titel,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        ); // Provide data to the template

        try {
          await sendMail({
            email: question.user.email,
            subject: "Qitel reply",
            template: "../mails/question-reply.ejs",
            data, // Pass the rendered HTML content
          });
        } catch (error: any) {
          return next(
            new ErrorHandler("Something went wrong" + "->" + error.message, 500)
          );
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler("Something went wrong" + "->" + error.message, 500)
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

// delete course -------------------------------------------------------------------------------------------------------

export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("course Not Found!", 404));
      }
      await course.deleteOne();

      await redis.del(id);

      res.status(200).json({
        success: true,
        messege: "course Deleted Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.messege, 400));
    }
  }
);