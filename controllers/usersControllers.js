import db from "./../database.js";

export async function getUserUrl(req, res) {

    const { id } = req.params;

    try {
        const checkUser = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);

        if (checkUser.rowCount === 0) return res.sendStatus(404);

        let userObject = {};
        const user = await db.query(
            `SELECT us.id AS "userId", us.name, ur.id, ur."shortUrl", ur.url, ur.views 
            FROM urls ur
            JOIN users us ON ur."userId" = us.id
            WHERE "userId" = $1 ORDER BY ur.id;`, [id]);
        let visitCount = 0;

        user.rows.forEach(row => {
            const { views } = row;
            visitCount += views;
        });
        if (user.rowCount !== 0) userObject =
        {
            id: user.rows[0].userId,
            name: user.rows[0].name,
            visitCount,
            shortenedUrls: user.rows.map(row => {
                const { id, shortUrl, url, views } = row;
                return (
                    {
                        id,
                        shortUrl,
                        url,
                        views
                    }
                )
            })
        };


        else userObject =
        {
            id: checkUser.rows[0].id,
            name: checkUser.rows[0].name,
            visitCount: 0,
            shortenedUrls: 0
        }

        return res.send(userObject);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export async function getRanking(req, res) {
    const limit = 10;
    try {
        const ranking = await db.query(`
        SELECT us.id, us.name, count("views") as "linksCount", sum("views") as "visitCount"
        FROM urls ur
        JOIN users us ON ur."userId" = us.id
        GROUP BY (us.id)
        ORDER BY "visitCount" DESC LIMIT $1`, [limit])
        res.status(200).send(ranking.rows);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
