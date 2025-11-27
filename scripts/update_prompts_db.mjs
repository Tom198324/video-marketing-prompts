import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { prompts } from '../drizzle/schema.ts';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const db = drizzle(process.env.DATABASE_URL);

async function updatePromptsInDatabase() {
  const promptsDir = '/home/ubuntu/prompts_normalized';
  const files = readdirSync(promptsDir).filter(f => f.startsWith('prompt_') && f.endsWith('.json')).sort();
  
  console.log(`Mise à jour de ${files.length} prompts dans la base de données...\n`);
  console.log('='.repeat(100));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    try {
      const filePath = join(promptsDir, file);
      const data = JSON.parse(readFileSync(filePath, 'utf-8'));
      
      const metadata = data.metadata;
      const promptJson = JSON.stringify(data.prompt);
      
      // Mettre à jour le prompt dans la base de données
      await db.update(prompts)
        .set({
          promptJson: promptJson,
          updatedAt: new Date()
        })
        .where(eq(prompts.promptNumber, metadata.prompt_number));
      
      console.log(`✅ Mis à jour: Prompt #${metadata.prompt_number}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(100));
  console.log(`\n📊 RÉSUMÉ:`);
  console.log(`   ✅ Prompts mis à jour: ${successCount}/${files.length}`);
  console.log(`   ❌ Erreurs: ${errorCount}/${files.length}`);
  console.log(`\n✨ Mise à jour de la base de données terminée!`);
}

updatePromptsInDatabase().catch(console.error);
