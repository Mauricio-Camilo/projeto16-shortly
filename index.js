import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import db from "./database.js"

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.get("/teste", async (req, res) => {
    console.log("Teste do heroku");
    try {
        const result = await db.query(`SELECT * FROM categories`);
        res.send(result.rows);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500); // internal server error
      }
    // res.sendStatus(200);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});