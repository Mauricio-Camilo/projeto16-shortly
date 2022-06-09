import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import joi from "joi";
import { v4 as uuid } from "uuid";
import db from "./database.js";
import { nanoid } from 'nanoid';
import authRouter from "./routers/authRouter.js";
import urlRouter from "./routers/urlRouter.js"
import usersRouter from "./routers/usersRouter.js"


dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(authRouter);
app.use(urlRouter);
app.use(usersRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,
    () => { console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`)) });