import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { prompts } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { eq } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log("🎯 Starting quality score calculation for all 50 prompts...\n");

const allPrompts = await db.select().from(prompts).orderBy(prompts.promptNumber);

console.log(`Found ${allPrompts.length} prompts to evaluate\n`);

let processed = 0;
let errors = 0;

for (const prompt of allPrompts) {
  try {
    console.log(`[${processed + 1}/${allPrompts.length}] Evaluating Prompt #${prompt.promptNumber}: ${prompt.title}`);
    
    const promptJson = JSON.parse(prompt.promptJson);
    
    // Use LLM to evaluate coherence
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert video prompt evaluator. Analyze the prompt's overall coherence and quality across all 8 sections (Shot, Subject, Action, Scene, Cinematography, Audio, Visual Rules, Technical Specifications). Return ONLY a JSON object with 'score' (0-10 integer) and 'reasoning' (brief explanation)."
        },
        {
          role: "user",
          content: `Evaluate this prompt for coherence and quality:\n\nTitle: ${prompt.title}\nSector: ${prompt.industrySector}\n\nPrompt:\n${JSON.stringify(promptJson, null, 2)}\n\nProvide overall quality score (0-10) and brief reasoning.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const evaluation = JSON.parse(typeof content === 'string' ? content : '{}');
    const score = Math.round(evaluation.score || 0);

    // Update database
    await db.update(prompts)
      .set({ qualityScore: score })
      .where(eq(prompts.id, prompt.id));

    console.log(`  ✅ Score: ${score}/10 - ${evaluation.reasoning?.substring(0, 80)}...\n`);
    processed++;
    
  } catch (error) {
    console.error(`  ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    errors++;
  }
}

console.log(`\n🎉 Completed!`);
console.log(`✅ Successfully evaluated: ${processed}/${allPrompts.length}`);
console.log(`❌ Errors: ${errors}`);

await connection.end();
