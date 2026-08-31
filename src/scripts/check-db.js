import {pool} from "../db/pool.js";

try {
    const [databaseRows] = await pool.query(
        "SELECT DATABASE() AS databaseName, NOW(3) AS serverTime",
    );

    const [countRows] = await pool.query(
    "SELECT COUNT(*) AS experienceCount FROM experiences",
    );

    console.log("Database connection successful");
    console.log({
    databaseName: databaseRows[0].databaseName,
    serverTime: databaseRows[0].serverTime,
    experienceCount: countRows[0].experienceCount,
    });
}catch (error) {
  console.error("Database connection failed");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}