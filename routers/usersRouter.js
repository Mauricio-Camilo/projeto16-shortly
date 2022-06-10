import {Router} from "express";
import { getUserUrl, getRanking } from "./../controllers/usersControllers.js"
import { validateToken } from "./../middlewares/authMiddlewares.js"

const usersRouter = Router();

usersRouter.get("/users/:id", validateToken, getUserUrl);
usersRouter.get("/ranking", getRanking);


export default usersRouter;