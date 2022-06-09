import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import joi from "joi";
import {v4 as uuid} from "uuid";
import db from "./database.js";
import { nanoid } from 'nanoid';

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

    if (validation.error) return res.status(422).send(validation.error.details); 
    

    try {
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [req.body.email]);
        if (user.rowCount === 0) return res.sendStatus(401);

        if (user.rowCount !== 0 && 
        bcrypt.compareSync(req.body.password, user.rows[0].password)) {
            const token = uuid();
            await db.query(`INSERT INTO sessions (token, "userId") 
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

app.post("/urls/shorten", async (req,res) => {

    const urlSchema = joi.string().required();

    const validation = urlSchema.validate(req.body.url, {abortEarly: true});

    if (validation.error) return res.status(422).send(validation.error.details); 
    
    console.log("Chegou aqui");

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
  
    if(!token) return res.status(401).send("No token found.");
    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token=$1`, [token]);
        if (session.rows.length === 0) return res.status(401).send("No token found.");
                
        const user = await db.query(`SELECT * FROM users WHERE id=$1`, [session.rows[0].userId]);
        if(user.rowCount === 0) return res.status(401).send("No user found."); 
    
        console.log(user.rows[0]);

        const shortenURL = nanoid(10);
        await db.query(`INSERT INTO urls ("shortUrl", url, "userId")
        VALUES ($1, $2, $3)`, [shortenURL, req.body.url, user.rows[0].id]);
        res.send(shortenURL).status(200);
    }

    catch (error) {
        console.log(error);
        res.sendStatus(500); 
      }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});