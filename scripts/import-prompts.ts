import { drizzle } from "drizzle-orm/mysql2";
import { prompts } from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";

async function importPrompts() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  const promptsDir = "/home/ubuntu/prompts_20s";
  const files = fs.readdirSync(promptsDir).filter(f => f.startsWith("prompt_") && f.endsWith(".json")).sort();
  
  console.log(`Importing ${files.length} prompts...`);
  
  for (const file of files) {
    const filePath = path.join(promptsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    const metadata = data.metadata;
    const promptJson = data.prompt;
    
    await db.insert(prompts).values({
      promptNumber: metadata.prompt_number,
      title: metadata.description.split(" - ")[0] || `Prompt ${metadata.prompt_number}`,
      description: metadata.description,
      scenarioType: metadata.scenario_type,
      industrySector: metadata.industry_sector,
      visualStyle: metadata.visual_style,
      durationSeconds: metadata.duration_seconds,
      originalDuration: metadata.original_duration,
      promptJson: JSON.stringify(promptJson),
    });
    
    console.log(`✓ Imported prompt #${metadata.prompt_number}`);
  }
  
  console.log("\n✅ All prompts imported successfully!");
  process.exit(0);
}

importPrompts().catch(err => {
  console.error("❌ Error importing prompts:", err);
  process.exit(1);
});
