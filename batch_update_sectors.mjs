import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import fs from 'fs';

// Load update list
const updateData = JSON.parse(fs.readFileSync('/home/ubuntu/FINAL_SECTOR_UPDATE_MERGED.json', 'utf-8'));
const updates = updateData.updates;

console.log('='.repeat(80));
console.log('BATCH UPDATE: Industry Sectors for 38 Prompts');
console.log('='.repeat(80));
console.log(`Total updates to perform: ${updates.length}\n`);

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

let successCount = 0;
let errorCount = 0;

for (const update of updates) {
  try {
    await db.update(schema.prompts)
      .set({ industrySector: update.new_sector })
      .where(eq(schema.prompts.promptNumber, update.promptNumber));
    
    console.log(`✅ Prompt #${update.promptNumber}: ${update.old_sector} → ${update.new_sector}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Prompt #${update.promptNumber}: ERROR - ${error.message}`);
    errorCount++;
  }
}

await connection.end();

console.log('\n' + '='.repeat(80));
console.log('UPDATE SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Successful updates: ${successCount}/${updates.length}`);
console.log(`❌ Failed updates: ${errorCount}`);
console.log(`📊 Success rate: ${(successCount / updates.length * 100).toFixed(1)}%`);

if (successCount === updates.length) {
  console.log('\n🎉 ALL UPDATES COMPLETED SUCCESSFULLY!');
} else {
  console.log('\n⚠️  Some updates failed. Please review errors above.');
}
