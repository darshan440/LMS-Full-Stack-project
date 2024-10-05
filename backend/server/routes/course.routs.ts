import express from "express";
import { authorizeRoles, 
  isAuthenticated } from "../middalware/auth";
import {
  addAnswer,
  addQuestion,
  deleteCourse,
  editCourse,
  getAllCourse,
  generateVideoUrl,
  getAllCourses,
  getContent,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { addReplyToReview, addReview,updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
 
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-post/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-sourses", getAllCourses);
courseRouter.get("/get-course-content/:id", updateAccessToken,
  isAuthenticated, getContent);
courseRouter.put("/add-Question", updateAccessToken,
  isAuthenticated, addQuestion);
courseRouter.put("/add-answer", updateAccessToken,
  isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", updateAccessToken,
  isAuthenticated, addReview);
courseRouter.put("/add-reply", updateAccessToken,
  isAuthenticated, authorizeRoles("admin"), addReplyToReview);
courseRouter.get(
  "/get-courses",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCourse
);
courseRouter.post("/getVdoCipherOTP", generateVideoUrl); // add is authenticated after demo
courseRouter.delete("/delete-course/:id", updateAccessToken,
  isAuthenticated, authorizeRoles("admin"), deleteCourse);

export default courseRouter;
