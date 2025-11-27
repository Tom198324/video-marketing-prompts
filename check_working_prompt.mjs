import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Check prompt #1 (should have proper structure)
const result = await db.select().from(prompts).where(eq(prompts.promptNumber, 1));

if (result.length > 0) {
  const prompt = result[0];
  const promptJson = typeof prompt.promptJson === 'string' 
    ? JSON.parse(prompt.promptJson) 
    : prompt.promptJson;
  
  console.log('=== Prompt #1 Structure ===');
  console.log('Title:', prompt.title);
  console.log('\n=== Available Top-Level Fields ===');
  console.log(Object.keys(promptJson));
  
  if (promptJson.technical_specifications) {
    console.log('\n=== Technical Specifications ===');
    console.log(JSON.stringify(promptJson.technical_specifications, null, 2));
  }
}

await connection.end();
