import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import db from "./database.js";
import joi from "joi";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/signup", async (req, res) => {
    
    const {name, email, password, confirmPassword} = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(), //README: MUDAR PARA EMAIL DEPOIS
        password: joi.string().required(),
        confirmPassword: joi.ref('password')
    });

    const validation = userSchema.validate(req.body, {abortEarly: true});

    if (validation.error) {
        console.log(validation.error.details);
        return res.sendStatus(422);  
    }

    const cryptPassword = bcrypt.hashSync(password, 10);

    console.log(cryptPassword);

    try {
        await db.query(`INSERT INTO users (name, email, password) 
        VALUES ($1, $2, $3)`,[name, email, cryptPassword]);
        res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500); 
      }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});