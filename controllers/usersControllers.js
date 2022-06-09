import db from "./../database.js";

export default async function getUserUrl (req, res) {

    const { id } = req.params;
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
    if (user.rowCount !== 0) {
        userObject = {
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
        return res.send(userObject);
    }
    else return res.status(400).send("This user does not have shortlinks registered");
 }
