import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Load improvements
const improvements = JSON.parse(fs.readFileSync('/home/ubuntu/batch_improvements_results.json', 'utf-8'));

console.log(`Starting database update for ${improvements.length} prompts...`);

let successCount = 0;
let errorCount = 0;

for (const improvement of improvements) {
  if (improvement.error) {
    console.log(`⏭️  Skipping prompt #${improvement.prompt_number} (had error)`);
    errorCount++;
    continue;
  }
  
  try {
    const num = improvement.prompt_number;
    const paddedNum = String(num).padStart(2, '0');
    
    // Load current prompt data
    const currentPrompt = JSON.parse(fs.readFileSync(`/home/ubuntu/prompt_${paddedNum}.json`, 'utf-8'));
    const promptJson = typeof currentPrompt.promptJson === 'string' 
      ? JSON.parse(currentPrompt.promptJson) 
      : currentPrompt.promptJson;
    
    // Update sequences (keep sequence 1, replace 2 and 3)
    promptJson.action.sequences = [
      promptJson.action.sequences[0], // Keep original sequence 1
      {
        timing: "8-14 seconds",
        primary_motion: improvement.sequence_2_improved,
        camera_follows: improvement.sequence_2_camera
      },
      {
        timing: "14-20 seconds",
        primary_motion: improvement.sequence_3_improved,
        camera_follows: improvement.sequence_3_camera
      }
    ];
    
    // Update database
    await db.update(prompts)
      .set({ 
        promptJson: JSON.stringify(promptJson),
        updatedAt: new Date()
      })
      .where(eq(prompts.promptNumber, num));
    
    console.log(`✅ [${successCount + 1}/${improvements.length}] Prompt #${num} updated (${improvement.coherence_score_before}/10 → ${improvement.coherence_score_after}/10)`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ Error updating prompt #${improvement.prompt_number}:`, error.message);
    errorCount++;
  }
}

await connection.end();

console.log(`\n✅ Database update completed!`);
console.log(`Success: ${successCount}`);
console.log(`Errors: ${errorCount}`);
console.log(`Total: ${improvements.length}`);

