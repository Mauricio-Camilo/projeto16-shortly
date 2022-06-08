import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

let objectConfig = {connectionString: process.env.DATABASE_URL_LOCAL};

if(process.env.MODE === "PROD") {
    objectConfig.ssl = {
      rejectUnauthorized: false
    }
  }

const db = new Pool(objectConfig);

export default db;