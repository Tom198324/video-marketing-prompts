import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  const [rows] = await connection.query(
    "SELECT promptNumber, title, industrySector, visualStyle, scenarioType FROM prompts ORDER BY promptNumber"
  );
  
  console.log("All Metadata:");
  (rows as any[]).forEach(row => {
    console.log(`${row.promptNumber}|${row.title}|${row.industrySector}|${row.visualStyle}|${row.scenarioType}`);
  });
  
  await connection.end();
}

main().catch(console.error);
