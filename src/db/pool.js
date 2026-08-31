import mysql from "mysql2/promise.js"
import {env} from "../config/env.js"

export const pool = mysql.createPool({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  timezone: "Z",
  supportBigNumbers: true,
  bigNumberStrings: true,
});