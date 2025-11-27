import { drizzle } from 'drizzle-orm/mysql2';
import { prompts } from '../drizzle/schema.ts';
import { readFileSync } from 'fs';

const db = drizzle(process.env.DATABASE_URL);

// Charger les prompts enrichis
const enrichedPrompts = JSON.parse(
  readFileSync('/home/ubuntu/50_prompts_enriched_final.json', 'utf-8')
);

console.log(`📥 Chargement de ${enrichedPrompts.length} prompts enrichis...`);

// Récupérer tous les prompts de la DB
const dbPrompts = await db.select().from(prompts);

console.log(`📊 ${dbPrompts.length} prompts trouvés dans la base de données`);

let updated = 0;
let errors = 0;

// Mettre à jour chaque prompt
for (let i = 0; i < dbPrompts.length && i < enrichedPrompts.length; i++) {
  try {
    const dbPrompt = dbPrompts[i];
    const enrichedPrompt = enrichedPrompts[i];
    
    // Parser le JSON existant
    const promptData = JSON.parse(dbPrompt.promptJson);
    
    // Mettre à jour visual_rules
    promptData.visual_rules = enrichedPrompt.visual_rules;
    
    // Sauvegarder dans la DB
    await db.update(prompts)
      .set({ promptJson: JSON.stringify(promptData) })
      .where(eq(prompts.id, dbPrompt.id));
    
    updated++;
    
    if (updated % 10 === 0) {
      console.log(`  ✓ ${updated} prompts mis à jour...`);
    }
  } catch (error) {
    console.error(`  ✗ Erreur prompt ${i + 1}:`, error.message);
    errors++;
  }
}

console.log(`\n✅ Mise à jour terminée!`);
console.log(`  - Succès: ${updated} prompts`);
console.log(`  - Erreurs: ${errors} prompts`);
