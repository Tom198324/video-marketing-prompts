import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.select().from(prompts).where(eq(prompts.promptNumber, 3));

if (result.length > 0) {
  console.log(JSON.stringify(result[0], null, 2));
} else {
  console.log('Prompt #3 not found');
}

await connection.end();
