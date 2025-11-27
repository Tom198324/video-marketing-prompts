import mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";

async function createTables() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true },
    multipleStatements: true
  });
  
  const sql = fs.readFileSync("/home/ubuntu/video-marketing-prompts/scripts/create_tables.sql", "utf-8");
  
  console.log("Creating tables...");
  await connection.query(sql);
  console.log("✓ Tables created successfully!");
  
  await connection.end();
}

createTables().catch(err => {
  console.error("❌ Error creating tables:", err);
  process.exit(1);
});
