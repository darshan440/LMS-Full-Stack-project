import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import NotificationModel, { notificationSchema } from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";


export const getNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            notification,
        })
    } catch (error : any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// update notification status - only admin 
export const updateNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("notification not found", 404));

        } else {
            notification.status ? (notification.status = "read") : notification.status;
        }

        await notification.save();

        const notifications = await NotificationModel.find().sort({
          createdAt: -1,
        });

        res.status(201).json({
            success: true,
            notification,
        })
    } catch (error:any) {
        
    }
})


// delete notificatio  -- only admin 
cron.schedule("0 0 0 * * *", async() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
})