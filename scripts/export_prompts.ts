import mysql from "mysql2/promise";
import * as fs from "fs";

async function exportPrompts() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log("Exporting English prompts from database...\n");
  
  const [rows] = await connection.query(
    "SELECT * FROM prompts ORDER BY promptNumber"
  );
  
  const prompts = rows as any[];
  console.log(`Found ${prompts.length} prompts in database`);
  
  // Create output directory
  const outputDir = "/home/ubuntu/english_prompts_db";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Export each prompt
  for (const prompt of prompts) {
    const filename = `${outputDir}/prompt_${String(prompt.promptNumber).padStart(2, '0')}.json`;
    const jsonData = JSON.parse(prompt.promptJson);
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    console.log(`✓ Exported prompt #${prompt.promptNumber}: ${prompt.title}`);
  }
  
  console.log(`\n✅ All ${prompts.length} prompts exported to ${outputDir}`);
  
  await connection.end();
}

exportPrompts().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
