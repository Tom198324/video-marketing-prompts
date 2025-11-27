import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.select().from(prompts).where(eq(prompts.promptNumber, 3));

if (result.length > 0) {
  const prompt = result[0];
  const promptJson = typeof prompt.promptJson === 'string' 
    ? JSON.parse(prompt.promptJson) 
    : prompt.promptJson;
  
  console.log('=== Prompt #3 Structure ===');
  console.log('Title:', prompt.title);
  console.log('\nTechnical Specifications:');
  console.log(JSON.stringify(promptJson.technical_specifications || {}, null, 2));
  
  // Check what fields exist
  console.log('\n=== Available Top-Level Fields ===');
  console.log(Object.keys(promptJson));
  
  fs.writeFileSync('/home/ubuntu/prompt3_debug.json', JSON.stringify(promptJson, null, 2));
  console.log('\n✅ Full structure saved to /home/ubuntu/prompt3_debug.json');
}

await connection.end();
