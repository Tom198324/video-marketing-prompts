import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { eq } from 'drizzle-orm';

// Charger les prompts enrichis
const enrichedPrompts = JSON.parse(
  readFileSync('/home/ubuntu/50_prompts_enriched_final.json', 'utf-8')
);

console.log(`📥 ${enrichedPrompts.length} prompts enrichis chargés`);

// Créer la connexion
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('✅ Connexion à la base de données établie');

// Récupérer tous les prompts
const [rows] = await connection.execute('SELECT id, promptJson FROM prompts ORDER BY id');

console.log(`📊 ${rows.length} prompts trouvés dans la DB`);

let updated = 0;

// Mettre à jour chaque prompt
for (let i = 0; i < rows.length && i < enrichedPrompts.length; i++) {
  const row = rows[i];
  const enrichedPrompt = enrichedPrompts[i];
  
  try {
    // Parser le JSON existant
    const promptData = JSON.parse(row.promptJson);
    
    // Mettre à jour visual_rules
    promptData.visual_rules = enrichedPrompt.visual_rules;
    
    // Sauvegarder
    const newJson = JSON.stringify(promptData);
    await connection.execute(
      'UPDATE prompts SET promptJson = ? WHERE id = ?',
      [newJson, row.id]
    );
    
    updated++;
    
    if (updated % 10 === 0) {
      console.log(`  ✓ ${updated} prompts mis à jour...`);
    }
  } catch (error) {
    console.error(`  ✗ Erreur prompt ${i + 1}:`, error.message);
  }
}

await connection.end();

console.log(`\n✅ TERMINÉ!`);
console.log(`  ${updated}/${rows.length} prompts mis à jour avec succès`);
