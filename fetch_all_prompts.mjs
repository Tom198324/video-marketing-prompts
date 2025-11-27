import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('Fetching all 50 prompts from database...');
const allPrompts = await db.select().from(prompts);

console.log(`✅ Retrieved ${allPrompts.length} prompts`);

// Save to file
fs.writeFileSync('/home/ubuntu/all_prompts_data.json', JSON.stringify(allPrompts, null, 2));
console.log('✅ Saved to /home/ubuntu/all_prompts_data.json');

await connection.end();
