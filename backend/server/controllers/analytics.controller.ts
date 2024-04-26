import { NextFunction ,Response,Request } from "express";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import { gererateLast12MonthsData } from "../utils/analytics.generator";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";



// user analytics 
export const getUsersAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await gererateLast12MonthsData(userModel);
        res.status(200).json({
            success: true,
            users,
        })
    } catch (error : any) {
        return next (new ErrorHandler(error.messege, 404))
    }
})

// order analytics 
export const getOrdersAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await gererateLast12MonthsData(OrderModel);
        res.status(200).json({
            success: true,
            orders,
        })
    } catch (error : any) {
        return next (new ErrorHandler(error.messege, 404))
    }
})

// course analytics 
export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await gererateLast12MonthsData(CourseModel);
        res.status(200).json({
            success: true,
            course,
        })
    } catch (error : any) {
        return next (new ErrorHandler(error.messege, 404))
    }
})