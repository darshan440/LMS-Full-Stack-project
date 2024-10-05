import  Express  from "express";
import { authorizeRoles, 
  isAuthenticated } from "../middalware/auth";
import { getCourseAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";
import { updateAccessToken } from "../controllers/user.controller";
const analyticsRouter = Express.Router();


analyticsRouter.get("/get-user-analytics", updateAccessToken,
  isAuthenticated, authorizeRoles('admin'), getUsersAnalytics);
analyticsRouter.get("/get-order-analytics", updateAccessToken,
  isAuthenticated, authorizeRoles('admin'), getCourseAnalytics);
analyticsRouter.get("/get-course-analytics", updateAccessToken,
  isAuthenticated, authorizeRoles('admin'), getOrdersAnalytics);


export default analyticsRouter;