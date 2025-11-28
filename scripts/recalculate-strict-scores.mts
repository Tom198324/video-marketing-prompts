import { getDb, getAllPrompts } from "../server/db";
import { prompts } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { eq } from "drizzle-orm";

console.log("🎯 Recalculating quality scores with ULTRA-DEMANDING methodology...\n");

const allPrompts = await getAllPrompts();
const db = await getDb();

const oldScores: Record<number, number | null> = {};
const newScores: Record<number, number> = {};

for (const prompt of allPrompts) {
  console.log(`\n📊 Evaluating Prompt #${prompt.promptNumber}: ${prompt.title}`);
  
  // Store old score
  oldScores[prompt.promptNumber] = prompt.qualityScore;
  
  const promptJson = JSON.parse(prompt.promptJson);
  
  try {
    const analysisResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a WORLD-CLASS cinematography expert with 20+ years of experience in Oscar-winning productions (Blade Runner 2049, 1917, The Revenant). You have ZERO tolerance for mediocrity.

CRITICAL EVALUATION STANDARDS:
- 10/10 = PERFECT - Worthy of Cannes Film Festival, zero improvements possible
- 9/10 = CINEMATIC EXCELLENCE - Hollywood/Pixar level, ready for Super Bowl commercial
- 8/10 = PROFESSIONAL MASTERY - High-end production quality, minor refinements only
- 7/10 = SOLID PROFESSIONAL - Good but needs optimization for premium use
- 6/10 = ACCEPTABLE - Multiple improvements required for professional standards
- 5/10 = MEDIOCRE - Significant weaknesses, major reconstruction needed
- 4/10 = POOR - Fundamental flaws, complete redesign required
- 1-3/10 = UNACCEPTABLE - Start from scratch

AUTOMATIC PENALTIES (apply these strictly):
- Generic sequences ("Sequence 2", "Product showcase", "Display features"): -5 points
- Narrative incoherence between sequences: -3 points
- Vague technical terms ("good lighting", "nice camera"): -3 points
- Missing emotional progression across sequences: -2 points
- Visual or narrative clichés: -2 points
- Imprecise timing (no seconds specified): -2 points
- Incomplete technical specifications: -3 points

ONLY award 9-10/10 if ALL criteria are met:
✓ Cinematic mastery in camera work (specific lens, aperture, movement)
✓ Precise timing down to the second for each action
✓ Clear emotional storytelling arc across all sequences
✓ Complete technical specifications (resolution, fps, color space, codec)
✓ Creative originality (no generic "showcase" language)
✓ Professional-grade audio design with specific sync points
✓ Perfect visual continuity and realism rules
✓ Specific subject details (age, expression, wardrobe evolution)

Be RUTHLESSLY CRITICAL. Excellence is the ONLY acceptable standard.`
        },
        {
          role: "user",
          content: `Analyze this video marketing prompt with EXTREME RIGOR:

Title: ${prompt.title}
Sector: ${prompt.industrySector}

Prompt JSON:
${JSON.stringify(promptJson, null, 2)}

EVALUATE EACH OF THE 8 SECTIONS:
1. Shot (camera_system, lens, composition, movement) - 20% weight
2. Subject (identity, appearance, expression, evolution) - 15% weight
3. Action (precise timing, specific movements, camera tracking) - 25% weight
4. Scene (location, time, weather, lighting, atmosphere) - 10% weight
5. Cinematography (camera settings, color, stabilization) - 15% weight
6. Audio (ambient, music, voice-over, sync) - 10% weight
7. Visual Rules (realism, continuity) - 5% weight
8. Technical Specifications (resolution, fps, codec, duration) - 0% (binary: complete or -3 penalty)

APPLY AUTOMATIC PENALTIES STRICTLY. Start from 5/10 baseline and justify every point above that.

Provide JSON with:
- overall_score (0-10, weighted average with penalties applied)
- overall_assessment (harsh critical evaluation)
- penalties_applied (array of penalty descriptions with point deductions)`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisContent = analysisResponse.choices[0].message.content;
    const analysis = JSON.parse(typeof analysisContent === 'string' ? analysisContent : '{}');
    
    const newScore = Math.round(analysis.overall_score * 10) / 10; // Round to 1 decimal
    newScores[prompt.promptNumber] = newScore;
    
    // Update database
    await db.update(prompts)
      .set({ qualityScore: newScore })
      .where(eq(prompts.id, prompt.id));
    
    const oldScore = oldScores[prompt.promptNumber];
    const change = oldScore !== null ? (newScore - oldScore).toFixed(1) : 'N/A';
    const changeIndicator = oldScore !== null && newScore < oldScore ? '📉' : oldScore !== null && newScore > oldScore ? '📈' : '➡️';
    
    console.log(`   Old Score: ${oldScore !== null ? oldScore.toFixed(1) : 'N/A'}/10`);
    console.log(`   New Score: ${newScore.toFixed(1)}/10 ${changeIndicator} (${change})`);
    console.log(`   Assessment: ${analysis.overall_assessment?.substring(0, 100)}...`);
    
    if (analysis.penalties_applied && analysis.penalties_applied.length > 0) {
      console.log(`   Penalties: ${analysis.penalties_applied.join(', ')}`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error evaluating prompt #${prompt.promptNumber}:`, error);
  }
}

console.log("\n\n📊 RECALCULATION SUMMARY\n");
console.log("=" .repeat(60));

const oldScoreValues = Object.values(oldScores).filter(s => s !== null) as number[];
const newScoreValues = Object.values(newScores);

const oldAvg = oldScoreValues.length > 0 ? oldScoreValues.reduce((a, b) => a + b, 0) / oldScoreValues.length : 0;
const newAvg = newScoreValues.reduce((a, b) => a + b, 0) / newScoreValues.length;

console.log(`Average Score (Old): ${oldAvg.toFixed(2)}/10`);
console.log(`Average Score (New): ${newAvg.toFixed(2)}/10`);
console.log(`Change: ${(newAvg - oldAvg).toFixed(2)} points`);

const scoreDistribution = {
  '9-10 (Gold)': newScoreValues.filter(s => s >= 9).length,
  '7-8.9 (Silver)': newScoreValues.filter(s => s >= 7 && s < 9).length,
  '5-6.9 (Bronze)': newScoreValues.filter(s => s >= 5 && s < 7).length,
  '0-4.9 (Poor)': newScoreValues.filter(s => s < 5).length,
};

console.log("\nScore Distribution:");
Object.entries(scoreDistribution).forEach(([range, count]) => {
  console.log(`  ${range}: ${count} prompts (${(count/50*100).toFixed(1)}%)`);
});

console.log("\n✅ Recalculation complete!");
