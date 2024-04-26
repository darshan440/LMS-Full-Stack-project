import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrderService, newOrder } from "../services/order.services";

//  create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      console.log("User Courses:", user?.courses); // Debugging

      const courseExistInUser = user?.courses.some(
        (item: any) => item._id.toString() === courseId.toString()
      );

      console.log("Course Exist in User:", courseExistInUser); // Debugging

      if (courseExistInUser) {
        return next(
          new ErrorHandler("you have alredy puchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("course not found", 400));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
            
                    template: "order-confirmation.ejs",
                    data: mailData,
            
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.messege, 500));
        }

        if (!course) {
             return next (new ErrorHandler("cour no found",404))
        } else {
            course.purchased += 1;
         }
          user?.courses.push(course?._id);
          
          await user?.save();

          await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course.name}`,
          });

          await course.save();

          newOrder(data, res, next);
        
     
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.messege, 404));
    }
  }
);