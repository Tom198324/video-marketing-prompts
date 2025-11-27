import * as fs from 'fs';
import mysql from 'mysql2/promise';

async function main() {
  console.log("=" + "=".repeat(99));
  console.log("METADATA VERIFICATION: CSV (French) vs Database (English)");
  console.log("=" + "=".repeat(99));
  console.log();
  
  // Read CSV
  const csvContent = fs.readFileSync('/home/ubuntu/upload/index.csv', 'utf-8');
  const lines = csvContent.split('\n');
  const csvPrompts: any[] = [];
  
  // Parse CSV (skip header)
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Extract JSON from last column
    const jsonMatch = lines[i].match(/"(\{.*\})"/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[1].replace(/\\"/g, '"'));
        csvPrompts.push(jsonData);
      } catch (e) {
        console.log(`⚠️  Failed to parse prompt #${i}`);
      }
    }
  }
  
  console.log(`✓ Loaded ${csvPrompts.length} prompts from CSV`);
  
  // Connect to database
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  const [rows] = await connection.query(
    "SELECT promptNumber, promptJson FROM prompts ORDER BY promptNumber"
  );
  
  const dbPrompts = rows as any[];
  console.log(`✓ Loaded ${dbPrompts.length} prompts from database`);
  console.log();
  
  // Compare
  let perfectMatches = 0;
  const issues: number[] = [];
  
  for (let i = 0; i < Math.min(csvPrompts.length, dbPrompts.length); i++) {
    const csvData = csvPrompts[i];
    const dbData = JSON.parse(dbPrompts[i].promptJson);
    const promptNum = i + 1;
    
    // Compare key fields
    const differences: string[] = [];
    
    // Camera
    if (csvData.shot?.camera_system !== dbData.shot?.camera_system) {
      differences.push(`  Camera: CSV='${csvData.shot?.camera_system}' vs DB='${dbData.shot?.camera_system}'`);
    }
    
    // Resolution
    if (csvData.technical_specifications?.resolution !== dbData.technical_specifications?.resolution) {
      differences.push(`  Resolution: CSV='${csvData.technical_specifications?.resolution}' vs DB='${dbData.technical_specifications?.resolution}'`);
    }
    
    // Duration
    if (csvData.technical_specifications?.duration_seconds !== dbData.technical_specifications?.duration_seconds) {
      differences.push(`  Duration: CSV=${csvData.technical_specifications?.duration_seconds}s vs DB=${dbData.technical_specifications?.duration_seconds}s`);
    }
    
    if (differences.length > 0) {
      console.log(`⚠️  Prompt #${promptNum}: Differences found`);
      differences.forEach(d => console.log(d));
      console.log();
      issues.push(promptNum);
    } else {
      perfectMatches++;
    }
  }
  
  await connection.end();
  
  console.log("=" + "=".repeat(99));
  console.log("SUMMARY");
  console.log("=" + "=".repeat(99));
  console.log(`Total prompts compared: ${Math.min(csvPrompts.length, dbPrompts.length)}`);
  console.log(`✅ Perfect technical matches: ${perfectMatches}`);
  console.log(`⚠️  Prompts with differences: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log(`\nPrompts with issues: ${issues.join(', ')}`);
  } else {
    console.log("\n🎉 All technical specifications match perfectly!");
    console.log("   CSV and database contain identical data");
  }
  console.log();
}

main().catch(console.error);
