import express from "express";
import { authorizeRoles, 
  isAuthenticated } from "../middalware/auth";
import { createLayout, getLayoutByType, updateLayout } from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";
const layoutRouts = express.Router()


layoutRouts.post("/create-layout", updateAccessToken,
  isAuthenticated, authorizeRoles("admin"), createLayout);
layoutRouts.put("/edit-layout", updateAccessToken,
  isAuthenticated, authorizeRoles("admin"), updateLayout);
layoutRouts.get(
  "/get-layout/:type",
  getLayoutByType
);


export default layoutRouts;