import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Load current data and improvements
const currentData = JSON.parse(fs.readFileSync('/home/ubuntu/prompt3_current_data.json', 'utf-8'));
const improvements = JSON.parse(fs.readFileSync('/home/ubuntu/prompt3_improved_sequences.json', 'utf-8'));

// Parse the current promptJson
const promptJson = typeof currentData.promptJson === 'string' 
  ? JSON.parse(currentData.promptJson) 
  : currentData.promptJson;

// Update sequences with improvements (keep sequence 1, replace 2 and 3)
promptJson.action.sequences = [
  promptJson.action.sequences[0], // Keep original sequence 1
  improvements.sequence_2,
  improvements.sequence_3
];

// Convert back to JSON string
const updatedPromptJson = JSON.stringify(promptJson);

console.log('Updating prompt #3 in database...');
console.log('New sequences:');
console.log(JSON.stringify(promptJson.action.sequences, null, 2));

// Update database
await db.update(prompts)
  .set({ 
    promptJson: updatedPromptJson,
    updatedAt: new Date()
  })
  .where(eq(prompts.promptNumber, 3));

console.log('\n✅ Prompt #3 updated successfully!');

// Verify the update
const result = await db.select().from(prompts).where(eq(prompts.promptNumber, 3));
const verifyJson = typeof result[0].promptJson === 'string' 
  ? JSON.parse(result[0].promptJson) 
  : result[0].promptJson;

console.log('\nVerification - Sequence 2:');
console.log(verifyJson.action.sequences[1].primary_motion.substring(0, 100) + '...');
console.log('\nVerification - Sequence 3:');
console.log(verifyJson.action.sequences[2].primary_motion.substring(0, 100) + '...');

await connection.end();
