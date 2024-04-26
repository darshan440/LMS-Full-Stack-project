import express from "express";
import { authorizeRoles, isAuthenticated } from "../middalware/auth";
import { createLayout, getLayoutByType, updateLayout } from "../controllers/layout.controller";
const layoutRouts = express.Router()


layoutRouts.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout);
layoutRouts.put("/edit-layout", isAuthenticated, authorizeRoles("admin"), updateLayout);
layoutRouts.get(
  "/get-layout-wtype",
  getLayoutByType
);


export default layoutRouts;