import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middalware/auth";
import { getNotification, updateNotification } from "../controllers/notification.cotroller";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notification",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotification
);
notificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);


export default notificationRouter;