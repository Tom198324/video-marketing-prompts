import { getDb, getAllPrompts } from "../server/db";
import { prompts } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { eq } from "drizzle-orm";

console.log("🚀 Optimizing prompts with scores < 5/10 using ULTRA-DEMANDING standards...\n");

const allPrompts = await getAllPrompts();
const db = await getDb();

// Filter prompts with score < 5
const poorPrompts = allPrompts.filter(p => p.qualityScore !== null && p.qualityScore < 5);

console.log(`Found ${poorPrompts.length} prompts requiring optimization:\n`);
poorPrompts.forEach(p => {
  console.log(`  #${p.promptNumber} - ${p.title} (${p.qualityScore}/10)`);
});

console.log("\n" + "=".repeat(80) + "\n");

const results: Array<{
  promptNumber: number;
  title: string;
  oldScore: number;
  newScore: number;
  improvement: number;
}> = [];

for (const prompt of poorPrompts) {
  console.log(`\n🎯 Optimizing Prompt #${prompt.promptNumber}: ${prompt.title}`);
  console.log(`   Current Score: ${prompt.qualityScore}/10`);
  
  const originalPrompt = JSON.parse(prompt.promptJson);
  
  try {
    // Step 1: Optimize the prompt
    const optimizationResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a WORLD-CLASS cinematography director and prompt engineer with expertise in Oscar-winning productions. Your optimization standards are UNCOMPROMISING.

OPTIMIZATION MISSION:
Transform mediocre prompts into CINEMATIC MASTERPIECES worthy of 9-10/10 scores.

MANDATORY IMPROVEMENTS:
1. ELIMINATE ALL GENERIC LANGUAGE:
   - Replace "showcase", "display", "demonstrate" with SPECIFIC ACTIONS
   - Replace "Sequence 1/2/3" with DESCRIPTIVE NARRATIVE BEATS
   - Replace vague terms with PRECISE TECHNICAL SPECIFICATIONS

2. ADD PRECISE TIMING:
   - Every action must have EXACT timing in seconds (e.g., "0-3s:", "3-8s:", "8-14s:")
   - Specify camera movement duration and speed
   - Define audio sync points precisely

3. CREATE EMOTIONAL ARC:
   - Sequence 1: INTRIGUE (establish mystery/desire)
   - Sequence 2: CONNECTION (build emotional engagement)
   - Sequence 3: IMPACT (deliver memorable climax)

4. SPECIFY TECHNICAL EXCELLENCE:
   - Camera: Exact model + lens (e.g., "ARRI Alexa Mini LF + Zeiss Supreme Prime 50mm T1.5")
   - Lighting: Specific setup (e.g., "3-point Rembrandt lighting, 5600K key, -2 stops fill")
   - Movement: Precise technique (e.g., "Ronin 2 gimbal, 0.5m/s dolly-in, smooth deceleration")

5. ENSURE VISUAL CONTINUITY:
   - Maintain consistent color temperature across sequences
   - Preserve subject appearance and wardrobe
   - Respect spatial and temporal logic

6. ELEVATE AUDIO DESIGN:
   - Specify ambient layers (e.g., "Soft cafe ambience 20dB, espresso machine hiss 35dB")
   - Define music cues with timing (e.g., "Minimal piano enters at 8s, crescendo 14-18s")
   - Add foley details (e.g., "Fabric rustle sync with hand movement at 5s")

RETURN ONLY THE COMPLETE OPTIMIZED JSON. No explanations, no markdown.`
        },
        {
          role: "user",
          content: `OPTIMIZE THIS PROMPT TO CINEMATIC EXCELLENCE (target 9-10/10):

Original Prompt:
${JSON.stringify(originalPrompt, null, 2)}

APPLY ALL MANDATORY IMPROVEMENTS:
✓ Remove ALL generic language ("showcase", "display", "Sequence X")
✓ Add precise timing in seconds for every action
✓ Create clear emotional progression (Intrigue → Connection → Impact)
✓ Specify exact camera equipment and settings
✓ Detail lighting setup with technical precision
✓ Define camera movements with speed and duration
✓ Add layered audio design with sync points
✓ Ensure perfect visual continuity
✓ Maintain exact JSON structure with all 8 sections

Return ONLY the complete optimized JSON (no markdown, no explanations).`
        }
      ],
      response_format: { type: "json_object" }
    });

    const optimizedContent = optimizationResponse.choices[0].message.content;
    const optimizedPrompt = JSON.parse(typeof optimizedContent === 'string' ? optimizedContent : '{}');
    
    console.log(`   ✅ Optimization complete`);
    
    // Step 2: Evaluate the optimized prompt
    const evaluationResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a WORLD-CLASS cinematography expert with 20+ years of experience in Oscar-winning productions. You have ZERO tolerance for mediocrity. Evaluate this prompt with EXTREME RIGOR.`
        },
        {
          role: "user",
          content: `Evaluate this optimized prompt and provide ONLY the overall_score (0-10) in JSON format:

${JSON.stringify(optimizedPrompt, null, 2)}

Return JSON with: { "overall_score": number }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const evaluationContent = evaluationResponse.choices[0].message.content;
    const evaluation = JSON.parse(typeof evaluationContent === 'string' ? evaluationContent : '{}');
    const newScore = Math.round(evaluation.overall_score * 10) / 10;
    
    console.log(`   📊 New Score: ${newScore}/10`);
    
    // Step 3: Update database
    await db.update(prompts)
      .set({ 
        promptJson: JSON.stringify(optimizedPrompt),
        qualityScore: newScore 
      })
      .where(eq(prompts.id, prompt.id));
    
    const improvement = newScore - (prompt.qualityScore || 0);
    const indicator = improvement > 0 ? '📈' : improvement < 0 ? '📉' : '➡️';
    
    console.log(`   ${indicator} Improvement: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)} points`);
    
    results.push({
      promptNumber: prompt.promptNumber,
      title: prompt.title,
      oldScore: prompt.qualityScore || 0,
      newScore,
      improvement
    });
    
  } catch (error) {
    console.error(`   ❌ Error optimizing prompt #${prompt.promptNumber}:`, error);
  }
}

console.log("\n\n" + "=".repeat(80));
console.log("📊 OPTIMIZATION SUMMARY\n");

const avgOldScore = results.reduce((sum, r) => sum + r.oldScore, 0) / results.length;
const avgNewScore = results.reduce((sum, r) => sum + r.newScore, 0) / results.length;
const avgImprovement = avgNewScore - avgOldScore;

console.log(`Prompts Optimized: ${results.length}`);
console.log(`Average Score Before: ${avgOldScore.toFixed(2)}/10`);
console.log(`Average Score After: ${avgNewScore.toFixed(2)}/10`);
console.log(`Average Improvement: ${avgImprovement > 0 ? '+' : ''}${avgImprovement.toFixed(2)} points`);

console.log("\nScore Distribution After Optimization:");
const newDistribution = {
  '9-10 (Gold)': results.filter(r => r.newScore >= 9).length,
  '7-8.9 (Silver)': results.filter(r => r.newScore >= 7 && r.newScore < 9).length,
  '5-6.9 (Bronze)': results.filter(r => r.newScore >= 5 && r.newScore < 7).length,
  '0-4.9 (Still Poor)': results.filter(r => r.newScore < 5).length,
};

Object.entries(newDistribution).forEach(([range, count]) => {
  console.log(`  ${range}: ${count} prompts (${(count/results.length*100).toFixed(1)}%)`);
});

console.log("\nTop 5 Improvements:");
results
  .sort((a, b) => b.improvement - a.improvement)
  .slice(0, 5)
  .forEach((r, i) => {
    console.log(`  ${i+1}. #${r.promptNumber} ${r.title}: ${r.oldScore} → ${r.newScore} (+${r.improvement.toFixed(1)})`);
  });

console.log("\n✅ Optimization complete!");
