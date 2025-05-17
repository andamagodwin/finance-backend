import { DataSource } from "typeorm";
import { join } from "path";
require("dotenv").config();

export let DatabaseConnection = new DataSource({
  host: process.env.DB_HOST,
  type: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: true,
  port: parseInt(process.env.DB_PORT ?? "3306"),
  entities: [join(__dirname, "Entities/*.ts")],
  ssl: {
    rejectUnauthorized: true
  },
});
