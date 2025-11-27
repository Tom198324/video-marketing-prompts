import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const allPrompts = await db.select().from(prompts);

console.log(`Checking ${allPrompts.length} prompts for missing fields...\n`);

const missingFields = [];

for (const prompt of allPrompts) {
  const promptJson = typeof prompt.promptJson === 'string' 
    ? JSON.parse(prompt.promptJson) 
    : prompt.promptJson;
  
  const missing = [];
  
  if (!promptJson.visual_rules) {
    missing.push('visual_rules');
  }
  
  if (!promptJson.technical_specifications) {
    missing.push('technical_specifications');
  } else {
    // Check if technical_specifications has required fields
    if (!promptJson.technical_specifications.resolution) {
      missing.push('technical_specifications.resolution');
    }
  }
  
  if (missing.length > 0) {
    missingFields.push({
      promptNumber: prompt.promptNumber,
      title: prompt.title,
      missing: missing
    });
    console.log(`❌ Prompt #${prompt.promptNumber} (${prompt.title}): Missing ${missing.join(', ')}`);
  } else {
    console.log(`✅ Prompt #${prompt.promptNumber} (${prompt.title}): OK`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Total prompts: ${allPrompts.length}`);
console.log(`Prompts with issues: ${missingFields.length}`);
console.log(`Prompts OK: ${allPrompts.length - missingFields.length}`);

if (missingFields.length > 0) {
  fs.writeFileSync('/home/ubuntu/prompts_with_missing_fields.json', JSON.stringify(missingFields, null, 2));
  console.log(`\n📄 Details saved to /home/ubuntu/prompts_with_missing_fields.json`);
}

await connection.end();
