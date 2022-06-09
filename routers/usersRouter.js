import {Router} from "express";
import getUserUrl from "./../controllers/usersControllers.js"
import { validateToken } from "./../middlewares/authMiddlewares.js"

const usersRouter = Router();

usersRouter.get("/users/:id", validateToken, getUserUrl);

export default usersRouter;