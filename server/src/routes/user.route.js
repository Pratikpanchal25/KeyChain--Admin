import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { tokenVarify } from "../middleware/tokenVarify.js";
const userRouter = Router()

userRouter.route("/create").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(tokenVarify, logoutUser)
userRouter.route("/current-user").get( tokenVarify, getCurrentUser);

export default userRouter