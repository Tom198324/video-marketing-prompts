import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log("📦 BACKING UP CURRENT DATABASE VALUES...");
  console.log("=".repeat(80));
  
  const [rows] = await connection.query(
    "SELECT promptNumber, title, industrySector, visualStyle FROM prompts ORDER BY promptNumber"
  );
  
  // Save backup as JSON
  const backup = {
    timestamp: new Date().toISOString(),
    data: rows
  };
  
  fs.writeFileSync(
    '/home/ubuntu/database_backup_before_update.json',
    JSON.stringify(backup, null, 2)
  );
  
  console.log(`✓ Backed up ${(rows as any[]).length} prompts`);
  console.log("✓ Backup saved to: /home/ubuntu/database_backup_before_update.json");
  console.log();
  
  // Display current values
  console.log("Current Database Values:");
  console.log("-".repeat(80));
  (rows as any[]).forEach(row => {
    console.log(`#${row.promptNumber}: ${row.industrySector} | ${row.visualStyle}`);
  });
  
  await connection.end();
}

main().catch(console.error);
