/**
 * Script to add Tone & Atmosphere section to all 50 Gold-tier prompts
 * This analyzes each prompt and adds appropriate tone based on content
 */

import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in environment");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// Tone mapping based on industry and content analysis
const TONE_MAPPING = {
  "Luxury Product": {
    primary_tone: "Luxury",
    secondary_tone: "Sophisticated",
    mood_keywords: ["elegant", "premium", "refined", "exclusive", "opulent"],
    emotional_arc: "Intrigue → Desire → Aspiration",
    visual_style_reference: "High-end fashion editorial with cinematic depth"
  },
  "Tech/SaaS": {
    primary_tone: "Innovative",
    secondary_tone: "Professional",
    mood_keywords: ["modern", "sleek", "cutting-edge", "dynamic", "confident"],
    emotional_arc: "Curiosity → Understanding → Empowerment",
    visual_style_reference: "Apple product launch aesthetic with minimalist precision"
  },
  "Food & Beverage": {
    primary_tone: "Appetizing",
    secondary_tone: "Warm",
    mood_keywords: ["inviting", "sensory", "rich", "artisanal", "intimate"],
    emotional_arc: "Anticipation → Satisfaction → Delight",
    visual_style_reference: "Chef's Table cinematography with macro detail"
  },
  "Fashion": {
    primary_tone: "Stylized",
    secondary_tone: "Bold",
    mood_keywords: ["vibrant", "confident", "expressive", "contemporary", "striking"],
    emotional_arc: "Attention → Admiration → Inspiration",
    visual_style_reference: "Runway-inspired with editorial flair"
  },
  "Automotive": {
    primary_tone: "Epic",
    secondary_tone: "Powerful",
    mood_keywords: ["dynamic", "commanding", "sleek", "exhilarating", "refined"],
    emotional_arc: "Anticipation → Excitement → Triumph",
    visual_style_reference: "Car commercial with cinematic grandeur"
  },
  "Real Estate": {
    primary_tone: "Aspirational",
    secondary_tone: "Serene",
    mood_keywords: ["spacious", "elegant", "inviting", "luxurious", "tranquil"],
    emotional_arc: "Discovery → Connection → Belonging",
    visual_style_reference: "Architectural photography with lifestyle warmth"
  },
  "Sports/Fitness": {
    primary_tone: "Energetic",
    secondary_tone: "Motivational",
    mood_keywords: ["dynamic", "powerful", "intense", "inspiring", "triumphant"],
    emotional_arc: "Challenge → Determination → Achievement",
    visual_style_reference: "Nike commercial with dramatic intensity"
  },
  "Beauty/Cosmetics": {
    primary_tone: "Elegant",
    secondary_tone: "Radiant",
    mood_keywords: ["soft", "luminous", "refined", "intimate", "transformative"],
    emotional_arc: "Curiosity → Enhancement → Confidence",
    visual_style_reference: "Beauty editorial with soft-focus glamour"
  }
};

// Analyze prompt content to determine appropriate tone
function analyzeToneFromPrompt(promptJson, title, sector) {
  // Default to sector-based tone
  let toneProfile = TONE_MAPPING["Luxury Product"]; // fallback
  
  // Match by sector keywords
  if (sector?.toLowerCase().includes("tech") || sector?.toLowerCase().includes("saas") || 
      title?.toLowerCase().includes("software") || title?.toLowerCase().includes("app")) {
    toneProfile = TONE_MAPPING["Tech/SaaS"];
  } else if (sector?.toLowerCase().includes("food") || sector?.toLowerCase().includes("coffee") || 
             sector?.toLowerCase().includes("restaurant") || title?.toLowerCase().includes("culinary")) {
    toneProfile = TONE_MAPPING["Food & Beverage"];
  } else if (sector?.toLowerCase().includes("fashion") || title?.toLowerCase().includes("fashion") || 
             title?.toLowerCase().includes("clothing")) {
    toneProfile = TONE_MAPPING["Fashion"];
  } else if (sector?.toLowerCase().includes("automotive") || title?.toLowerCase().includes("car") || 
             title?.toLowerCase().includes("vehicle")) {
    toneProfile = TONE_MAPPING["Automotive"];
  } else if (sector?.toLowerCase().includes("real estate") || title?.toLowerCase().includes("property") || 
             title?.toLowerCase().includes("home")) {
    toneProfile = TONE_MAPPING["Real Estate"];
  } else if (sector?.toLowerCase().includes("sports") || sector?.toLowerCase().includes("fitness") || 
             title?.toLowerCase().includes("athletic")) {
    toneProfile = TONE_MAPPING["Sports/Fitness"];
  } else if (sector?.toLowerCase().includes("beauty") || sector?.toLowerCase().includes("cosmetics") || 
             title?.toLowerCase().includes("skincare")) {
    toneProfile = TONE_MAPPING["Beauty/Cosmetics"];
  } else if (sector?.toLowerCase().includes("luxury") || title?.toLowerCase().includes("premium") || 
             title?.toLowerCase().includes("luxury")) {
    toneProfile = TONE_MAPPING["Luxury Product"];
  }
  
  return toneProfile;
}

// Main update function
async function updateAllPrompts() {
  console.log("🎨 Starting Tone & Atmosphere addition to all prompts...\n");
  
  // Get all prompts
  const prompts = await db.select().from(schema.prompts);
  console.log(`Found ${prompts.length} prompts to update\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const prompt of prompts) {
    try {
      const promptJson = JSON.parse(prompt.promptJson);
      
      // Check if already has tone_and_atmosphere
      if (promptJson.tone_and_atmosphere) {
        console.log(`⏭️  Skipping #${prompt.id} "${prompt.title}" - already has tone section`);
        skipped++;
        continue;
      }
      
      // Analyze and add tone
      const toneProfile = analyzeToneFromPrompt(promptJson, prompt.title, prompt.industrySector);
      
      // Create new prompt JSON with tone as first section
      const updatedPromptJson = {
        tone_and_atmosphere: toneProfile,
        ...promptJson
      };
      
      // Update in database
      await db.update(schema.prompts)
        .set({ 
          promptJson: JSON.stringify(updatedPromptJson),
          updatedAt: new Date()
        })
        .where(eq(schema.prompts.id, prompt.id));
      
      console.log(`✅ Updated #${prompt.id} "${prompt.title}"`);
      console.log(`   Tone: ${toneProfile.primary_tone} / ${toneProfile.secondary_tone}`);
      console.log(`   Arc: ${toneProfile.emotional_arc}\n`);
      
      updated++;
      
    } catch (error) {
      console.error(`❌ Error updating prompt #${prompt.id}:`, error.message);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log(`✅ Successfully updated: ${updated} prompts`);
  console.log(`⏭️  Skipped (already had tone): ${skipped} prompts`);
  console.log(`📊 Total processed: ${prompts.length} prompts`);
  console.log("=".repeat(60));
  
  await connection.end();
}

// Run the update
updateAllPrompts().catch(console.error);
