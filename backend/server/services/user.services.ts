import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";

export const getUserById = async (id: string, res: Response) => {
    try {
        const userJson = await redis.get(id);

        if (userJson) {
            const user = JSON.parse(userJson);
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            // If user is not found in Redis, fetch from database
            const user = await userModel.findById(id);
            if (!user) {
                throw new ErrorHandler("User not found", 404);
            }
            // Save user to Redis for future requests
            await redis.set(id, JSON.stringify(user));
            res.status(200).json({
                success: true,
                user,
            });
        }
    } catch (error:any) {
        // Handle errors
        console.error("Error in getUserById:", error);
        if (error instanceof ErrorHandler) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
};

export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });

    res.status(201).json({
        success: true,
        users,
    })
}
// update user role -----------------------------------------------------------------------------------------------------------

export const updateUserRoleService = async (res: Response, id: string, role: string) => {
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

    res.status(201).json({
        success: true,
        user,
    })
}