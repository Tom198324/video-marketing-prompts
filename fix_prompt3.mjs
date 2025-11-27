import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { prompts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Get prompt #3
const result = await db.select().from(prompts).where(eq(prompts.promptNumber, 3));

if (result.length > 0) {
  const prompt = result[0];
  const promptJson = typeof prompt.promptJson === 'string' 
    ? JSON.parse(prompt.promptJson) 
    : prompt.promptJson;
  
  console.log('Fixing prompt #3...');
  
  // Add missing visual_rules
  promptJson.visual_rules = {
    frame_purity: "without text overlays, logos unless branded, no subtitles, hyperrealistic rendering, no digital artifacts, no lens distortion.",
    quality_requirements: {
      no_artifacts: true,
      no_morphing: true,
      no_unnatural_motion: true,
      photorealism_level: "Cinematic 8K quality"
    },
    realism: "Ultra-detailed textures revealing the premium quality of the products. Consistent environmental reflections on glossy surfaces. Professional three-point lighting sculpting shapes. Visible macro details (grains, fibers, finishes).",
    continuity: "Continuity of environmental reflections on surfaces. Maintenance of cleanliness and product condition. Consistency of ambient lighting and color temperature. Smooth camera movements and transitions."
  };
  
  // Add missing technical_specifications
  promptJson.technical_specifications = {
    resolution: "4K (3840x2160)",
    color_space: "Rec. 2020",
    bit_depth: "10-bit",
    output_quality: "ProRes 422 HQ eq.",
    ai_model_preference: "Sora 2 or Veo 3",
    duration_seconds: 20
  };
  
  // Update database
  await db.update(prompts)
    .set({ 
      promptJson: JSON.stringify(promptJson),
      updatedAt: new Date()
    })
    .where(eq(prompts.promptNumber, 3));
  
  console.log('✅ Prompt #3 fixed successfully!');
  console.log('Added fields: visual_rules, technical_specifications');
}

await connection.end();
