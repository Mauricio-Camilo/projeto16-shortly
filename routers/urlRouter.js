import {Router} from "express";
import { postShorten, getUrlId, deleteUrlId } from "../controllers/urlControllers.js";
import validateToken from "./../middlewares/authMiddlewares.js"

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, postShorten);
urlRouter.get("/urls/:id", getUrlId);
urlRouter.delete("/urls/:id", validateToken, deleteUrlId)


export default urlRouter;