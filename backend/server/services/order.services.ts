
import { CatchAsyncError } from "../middalware/catchAsyncError";

import { NextFunction, Response } from "express";
import OrderModel, { IOrder, orderSchema } from "../models/order.model";
import ErrorHandler from "../utils/ErrorHandler";

// create new order
export const newOrder = CatchAsyncError(async (data: any, res: Response, next: NextFunction) =>{
    try {
        const order = await OrderModel.create(data);

        // Return the order in the response
        return res.status(201).json({
            success: true,
            order: order,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllOrderService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    orders,
  });
};