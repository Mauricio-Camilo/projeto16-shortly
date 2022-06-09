import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import db from "./../database.js";

export async function signUp (req, res) {
    
    const {name, email, password, confirmPassword} = req.body;

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
}

export async function signIn (req, res) {

    try {
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [req.body.email]);

        if (user.rowCount !== 0 && 
        bcrypt.compareSync(req.body.password, user.rows[0].password)) {
            const token = uuid();
            await db.query(`INSERT INTO sessions (token, "userId") 
            VALUES ($1, $2)`,[token, user.rows[0].id]);
            return res.status(200).send(token);
        }
        else return res.sendStatus(401);
    }

    catch (error) {
        console.log(error);
        res.sendStatus(500); 
      }

}