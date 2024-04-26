import express from "express";
import {
  activatUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middalware/auth";
import { refreshTokenOption } from "../utils/jwt";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activationUser", activatUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRouter.get("/get-users", isAuthenticated,authorizeRoles("admin"), getAllUsers);
userRouter.put("/update-user", isAuthenticated,authorizeRoles("admin"), updateUserRole);
userRouter.delete("/delete-user/:id", isAuthenticated,authorizeRoles("admin"), deleteUser);

export default userRouter;
