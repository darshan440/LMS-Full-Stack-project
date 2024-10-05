import express  from "express";
import { authorizeRoles, 
  isAuthenticated } from "../middalware/auth";
import { getNotification, updateNotification } from "../controllers/notification.cotroller";
import { updateAccessToken } from "../controllers/user.controller";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notification",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getNotification
);
notificationRouter.put(
  "/update-notification/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);


export default notificationRouter;