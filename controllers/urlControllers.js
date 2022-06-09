import joi from "joi";
import db from "./../database.js";
import { nanoid } from 'nanoid';

export async function postShorten (req, res) {

    const urlSchema = joi.string().required();

    const validation = urlSchema.validate(req.body.url, {abortEarly: true});

    if (validation.error) return res.status(422).send(validation.error.details); 

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
}