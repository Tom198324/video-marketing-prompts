import mysql from "mysql2/promise";

async function getStats() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log("Querying database statistics...\n");
  
  // Count unique sectors
  const [sectors] = await connection.query(
    "SELECT COUNT(DISTINCT industrySector) as count FROM prompts"
  );
  console.log("Unique Industry Sectors:", (sectors as any)[0].count);
  
  // List all unique sectors
  const [sectorList] = await connection.query(
    "SELECT DISTINCT industrySector FROM prompts ORDER BY industrySector"
  );
  console.log("\nSectors:");
  (sectorList as any[]).forEach(row => console.log("  -", row.industrySector));
  
  // Count unique visual styles
  const [styles] = await connection.query(
    "SELECT COUNT(DISTINCT visualStyle) as count FROM prompts"
  );
  console.log("\nUnique Visual Styles:", (styles as any)[0].count);
  
  // List all unique styles
  const [styleList] = await connection.query(
    "SELECT DISTINCT visualStyle FROM prompts ORDER BY visualStyle"
  );
  console.log("\nVisual Styles:");
  (styleList as any[]).forEach(row => console.log("  -", row.visualStyle));
  
  await connection.end();
}

getStats().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
