import joi from "joi";
import db from "./../database.js";
import { nanoid } from 'nanoid';

export async function postShorten(req, res) {

    const urlSchema = joi.string().required();

    const validation = urlSchema.validate(req.body.url, { abortEarly: true });

    if (validation.error) return res.status(422).send(validation.error.details);

    try {

        const {user} = res.locals;

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

export async function getUrlId(req, res) {
    try {
        const { id } = req.params;
        const findUrl = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
        if (findUrl.rowCount === 0) return res.sendStatus(404);
        else {
            const { id, shortUrl, url } = findUrl.rows[0];
            return res.send({ id, shortUrl, url });
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deleteUrlId(req, res) {

    try {

        const { id } = req.params; 
        const {user} = res.locals;

        const checkUrl = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);

        if (checkUrl.rowCount === 0) return res.sendStatus(404);

        if (user.rows[0].id !== checkUrl.rows[0].userId) return res.sendStatus(401);

        await db.query(`DELETE FROM urls WHERE id=$1`, [checkUrl.rows[0].id])
        return res.sendStatus(204);

    }

    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}