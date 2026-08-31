import "dotenv/config"

const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
}

const port = Number(process.env.PORT ?? 3000);
const databasePort = Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

if (!Number.isInteger(databasePort) || databasePort < 1 ||databasePort > 65535) {
  throw new Error("DB_PORT must be an integer between 1 and 65535");
}


export const env = Object.freeze({
  port,
  database: {
    host: process.env.DB_HOST,
    port: databasePort,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});