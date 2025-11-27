import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
  console.log("=".repeat(100));
  console.log("STEP 3: UPDATING DATABASE WITH NEW VALUES");
  console.log("=".repeat(100));
  console.log();
  
  // Load translated data
  const translatedData = JSON.parse(
    fs.readFileSync('/home/ubuntu/translated_excel_data.json', 'utf-8')
  );
  
  console.log(`✓ Loaded ${translatedData.data.length} translated prompts`);
  console.log();
  
  // Connect to database
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log("✓ Connected to database");
  console.log();
  
  // Update each prompt
  console.log("Updating prompts...");
  console.log("-".repeat(100));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const item of translatedData.data) {
    try {
      const [result] = await connection.query(
        `UPDATE prompts 
         SET industrySector = ?, visualStyle = ? 
         WHERE promptNumber = ?`,
        [item.sector_en, item.style_en, item.number]
      );
      
      console.log(`✓ #${item.number}: ${item.sector_en} | ${item.style_en}`);
      successCount++;
    } catch (error) {
      console.error(`✗ #${item.number}: ERROR - ${error}`);
      errorCount++;
    }
  }
  
  console.log();
  console.log("=".repeat(100));
  console.log(`✅ UPDATE COMPLETE: ${successCount} successful, ${errorCount} errors`);
  console.log("=".repeat(100));
  console.log();
  
  // Verify updates
  console.log("Verifying updates...");
  console.log("-".repeat(100));
  
  const [rows] = await connection.query(
    "SELECT promptNumber, industrySector, visualStyle FROM prompts ORDER BY promptNumber LIMIT 10"
  );
  
  console.log("First 10 prompts after update:");
  (rows as any[]).forEach(row => {
    console.log(`#${row.promptNumber}: ${row.industrySector} | ${row.visualStyle}`);
  });
  
  await connection.end();
  
  console.log();
  console.log("✓ Database connection closed");
}

main().catch(console.error);
