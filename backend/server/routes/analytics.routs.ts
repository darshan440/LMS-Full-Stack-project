import  Express  from "express";
import { authorizeRoles, isAuthenticated } from "../middalware/auth";
import { getCourseAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";
const analyticsRouter = Express.Router();


analyticsRouter.get("/get-user-analytics", isAuthenticated, authorizeRoles('admin'), getUsersAnalytics);
analyticsRouter.get("/get-order-analytics", isAuthenticated, authorizeRoles('admin'), getCourseAnalytics);
analyticsRouter.get("/get-course-analytics", isAuthenticated, authorizeRoles('admin'), getOrdersAnalytics);


export default analyticsRouter;