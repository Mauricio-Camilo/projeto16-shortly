import {Router} from "express";
import { signUp, signIn } from "../controllers/authControllers.js";
import { validateSignUp, validateSignIn } from "./../middlewares/authMiddlewares.js"

const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/signin", validateSignIn, signIn);

export default authRouter;