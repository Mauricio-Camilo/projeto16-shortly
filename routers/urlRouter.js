import {Router} from "express";
import { postShortUrl, getUrlId, getShortUrl, deleteUrlId } from "../controllers/urlControllers.js";
import { validatePostUrl, validateToken } from "./../middlewares/authMiddlewares.js"

const urlRouter = Router();

urlRouter.post("/urls/shorten",validatePostUrl, validateToken, postShortUrl);
urlRouter.get("/urls/:id", getUrlId);
urlRouter.get("/urls/open/:shortUrl", getShortUrl);
urlRouter.delete("/urls/:id", validateToken, deleteUrlId)

export default urlRouter;