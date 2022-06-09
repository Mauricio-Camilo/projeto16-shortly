import {Router} from "express";
import { postShorten } from "../controllers/urlControllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", postShorten);

export default urlRouter;