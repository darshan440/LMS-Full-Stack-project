import { Response } from "express";
import { CatchAsyncError } from "../middalware/catchAsyncError";
import CourseModel from "../models/course.model";

export const creatCourse = CatchAsyncError(async (data: any, res: Response) => {
  try {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error: any) {
    // Handle any errors that occur during course creation
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create course",
    });
  }
});


export const getAllCoursesService = async (res: Response) => {
  const course = await CourseModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    course,
  });
};