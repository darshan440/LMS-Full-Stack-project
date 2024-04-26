import express from "express";
import { authorizeRoles, isAuthenticated } from "../middalware/auth";
import {
  addAnswer,
  addQuestion,
  deleteCourse,
  editCourse,
  getAllCourse,
  getAllCourses,
  getContent,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { addReplyToReview, addReview, updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-post",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/update-post/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/getCourse/:id", getSingleCourse);
courseRouter.get("/getAllCourse", getAllCourses);
courseRouter.get("/getCourseContent/:id", isAuthenticated, getContent);
courseRouter.put("/add-Question", isAuthenticated, addQuestion);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put("/add-reply", isAuthenticated, authorizeRoles("admin"), addReplyToReview);
courseRouter.get("/get-courses", isAuthenticated, authorizeRoles("admin"), getAllCourse);
courseRouter.delete("/delete-course/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);

export default courseRouter;
