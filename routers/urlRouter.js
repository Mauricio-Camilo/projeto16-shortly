import {Router} from "express";
import { postShorten, getUrlId } from "../controllers/urlControllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", postShorten);
urlRouter.get("/urls/:id", getUrlId);


export default urlRouter;