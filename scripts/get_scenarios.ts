import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  const [rows] = await connection.query(
    "SELECT promptNumber, scenarioType FROM prompts ORDER BY promptNumber"
  );
  
  console.log("Scenario Types:");
  (rows as any[]).forEach(row => {
    console.log(`Prompt #${row.promptNumber}: ${row.scenarioType}`);
  });
  
  await connection.end();
}

main().catch(console.error);
