import {Router} from "express";
import { postShorten, getUrlId, getShortUrl, deleteUrlId } from "../controllers/urlControllers.js";
import validateToken from "./../middlewares/authMiddlewares.js"

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, postShorten);
urlRouter.get("/urls/:id", getUrlId);
urlRouter.get("/urls/open/:shortUrl", getShortUrl);
urlRouter.delete("/urls/:id", validateToken, deleteUrlId)


export default urlRouter;