import db from "./../database.js";
import { nanoid } from 'nanoid';

export async function postShortUrl(req, res) {

    try {
        const {user} = res.locals;

        const shortUrl = nanoid(10);

        await db.query(`INSERT INTO urls ("shortUrl", url, "userId")
        VALUES ($1, $2, $3)`, [shortUrl, req.body.url, user.rows[0].id]);
        const response = {shortUrl}
        res.status(201).send(response);
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

export async function getShortUrl (req, res) {

    const {shortUrl} = req.params;

    try {
        const findShortUrl = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
        if (findShortUrl.rowCount === 0) return res.sendStatus(404);

        const contagem = findShortUrl.rows[0].views;

        await db.query(`UPDATE urls SET views=$1 WHERE "shortUrl"=$2`, [contagem+1,findShortUrl.rows[0].shortUrl])
       
        res.redirect(200, findShortUrl.rows[0].url);
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