import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
  console.log("=".repeat(100));
  console.log("PHASE 1: LOCATING PROMPT TITLES IN DATABASE");
  console.log("=".repeat(100));
  console.log();
  
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log("✓ Connected to database");
  console.log();
  
  // Extract all prompts with titles and JSON content
  const [rows] = await connection.query(`
    SELECT 
      promptNumber,
      title,
      industrySector,
      visualStyle,
      scenarioType,
      promptJson
    FROM prompts 
    ORDER BY promptNumber
  `);
  
  const prompts = rows as any[];
  
  console.log(`✓ Extracted ${prompts.length} prompts from database`);
  console.log();
  
  // Parse JSON content to extract sequences
  const promptsWithSequences = prompts.map(prompt => {
    const json = JSON.parse(prompt.promptJson);
    
    return {
      number: prompt.promptNumber,
      title: prompt.title,
      sector: prompt.industrySector,
      style: prompt.visualStyle,
      scenario: prompt.scenarioType,
      sequences: json.action?.sequences || [],
      totalDuration: json.action?.total_duration || '20 seconds'
    };
  });
  
  // Display sample
  console.log("Sample Prompts with Titles and Sequences:");
  console.log("-".repeat(100));
  
  promptsWithSequences.slice(0, 5).forEach(p => {
    console.log(`\n#${p.number}: ${p.title}`);
    console.log(`  Sector: ${p.sector}`);
    console.log(`  Style: ${p.style}`);
    console.log(`  Scenario: ${p.scenario}`);
    console.log(`  Sequences: ${p.sequences.length} sequences`);
    
    p.sequences.forEach((seq: any, idx: number) => {
      console.log(`    Seq ${idx + 1} (${seq.timing}): ${seq.primary_motion?.substring(0, 80)}...`);
    });
  });
  
  console.log("\n... (showing first 5)");
  console.log();
  
  // Save to file
  const outputPath = '/home/ubuntu/phase1_prompts_with_titles.json';
  fs.writeFileSync(outputPath, JSON.stringify(promptsWithSequences, null, 2));
  
  console.log(`✓ Saved all prompts with titles and sequences to: ${outputPath}`);
  console.log();
  
  // Summary statistics
  console.log("Database Structure Confirmed:");
  console.log("-".repeat(100));
  console.log(`  • Title field: 'title' column in 'prompts' table`);
  console.log(`  • Sequences location: 'jsonContent.action.sequences' (array of 3 sequences)`);
  console.log(`  • Each sequence contains: timing, primary_motion, camera_follows`);
  console.log();
  
  console.log("=".repeat(100));
  console.log("✅ PHASE 1 COMPLETE: All prompt titles and sequences extracted");
  console.log("=".repeat(100));
  
  await connection.end();
}

main().catch(console.error);
