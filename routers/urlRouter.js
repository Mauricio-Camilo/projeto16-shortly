import {Router} from "express";
import { postShorten, getUrlId } from "../controllers/urlControllers.js";
import validateToken from "./../middlewares/authMiddlewares.js"

const urlRouter = Router();

urlRouter.post("/urls/shorten",validateToken, postShorten);
urlRouter.get("/urls/:id", getUrlId);


export default urlRouter;