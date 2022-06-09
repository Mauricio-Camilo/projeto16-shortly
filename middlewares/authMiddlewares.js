import { signInSchema, signUpSchema } from "../schemas/authSchemas.js";
import db from "./../database.js"

export function validateSignUp (req, res, next) {
    const {error} = signUpSchema.validate(req.body);
    if(error) return res.status(422).send(error.details); 
    next();
}

export function validateSignIn (req, res, next) {
    const {error} = signInSchema.validate(req.body);
    if(error) return res.status(422).send(error.details); 
    next();
}

export default async function validateToken (req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();

    if (!token) return res.status(401).send("No token found.");
    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token=$1`, [token]);
        if (session.rows.length === 0) return res.status(401).send("No token found.");

        const user = await db.query(`SELECT * FROM users WHERE id=$1`, [session.rows[0].userId]);
        if (user.rowCount === 0) return res.status(401).send("No user found.");

        res.locals.user = user;

        next();
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}