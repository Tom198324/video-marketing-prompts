import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const allPrompts = await db.select({
  promptNumber: prompts.promptNumber,
  title: prompts.title,
  industrySector: prompts.industrySector,
  visualStyle: prompts.visualStyle
}).from(prompts);

// Sort by promptNumber
allPrompts.sort((a, b) => a.promptNumber - b.promptNumber);

console.log(`Extracted ${allPrompts.length} prompts from database\n`);

// Show first 5
console.log('=== First 5 Prompts - Database Values ===');
for (const prompt of allPrompts.slice(0, 5)) {
  console.log(`\nPrompt #${prompt.promptNumber}:`);
  console.log(`  Title: ${prompt.title}`);
  console.log(`  Industry Sector: ${prompt.industrySector}`);
  console.log(`  Visual Style: ${prompt.visualStyle}`);
}

// Save to JSON
fs.writeFileSync('/home/ubuntu/database_current_values.json', JSON.stringify(allPrompts, null, 2));
console.log('\n✅ Database values saved to /home/ubuntu/database_current_values.json');

await connection.end();
