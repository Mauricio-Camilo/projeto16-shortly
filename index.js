import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import joi from "joi";
import {v4 as uuid} from "uuid";
import db from "./database.js";


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
        return res.send(validation.error.details).status(422);  
    }

    const cryptPassword = bcrypt.hashSync(password, 10);

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

app.post("/signin", async (req,res) => {
    const loginSchema = joi.object({
        email: joi.string().required(), //README: MUDAR PARA EMAIL DEPOIS
        password: joi.string().required()
    });

    const validation = loginSchema.validate(req.body, {abortEarly: true});

    if (validation.error) {
        console.log(validation.error.details);
        return res.send(validation.error.details).status(422);  
    }

    try {
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [req.body.email]);
        if (user.rows.length === 0) return res.sendStatus(401);

        if (user.rows.length !== 0 && 
        bcrypt.compareSync(req.body.password, user.rows[0].password)) {
            const token = uuid();
            await db.query(`INSERT INTO sessions (token, userId) 
            VALUES ($1, $2)`,[token, user.rows[0].id]);
            return res.sendStatus(201);
        }
        return res.sendStatus(422);
    }

    catch (error) {
        console.log(error);
        res.sendStatus(500); 
      }

})

const PORT = process.env.PORT || 5000;

app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});