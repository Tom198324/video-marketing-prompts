import mysql from "mysql2/promise";

async function checkTables() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  const [rows] = await connection.query("SHOW TABLES");
  console.log("Tables in database:", rows);
  
  await connection.end();
}

checkTables().catch(console.error);
