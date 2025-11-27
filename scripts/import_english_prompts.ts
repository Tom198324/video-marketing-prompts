import { drizzle } from "drizzle-orm/mysql2";
import { prompts } from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";

// Metadata for each prompt
const PROMPT_METADATA = [
  { num: 1, title: "Premium Smartphone Launch", sector: "Consumer Electronics", style: "Cinematic Hyperrealistic", scenario: "Product Launch" },
  { num: 2, title: "Luxury Anti-Aging Serum", sector: "Health & Beauty", style: "Elegant Luxe", scenario: "Product Demo" },
  { num: 3, title: "Premium Artisan Coffee", sector: "Food & Beverage", style: "Aspirational Lifestyle", scenario: "Product Demo" },
  { num: 4, title: "High-Performance Running Shoes", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Demo" },
  { num: 5, title: "Luxury Sedan Launch", sector: "Automotive", style: "Cinematic Hyperrealistic", scenario: "Product Launch" },
  { num: 6, title: "Smart Home Hub", sector: "Consumer Electronics", style: "Modern Minimalist", scenario: "Product Demo" },
  { num: 7, title: "Organic Skincare Line", sector: "Health & Beauty", style: "Natural Authentic", scenario: "Product Launch" },
  { num: 8, title: "Craft Beer Tasting", sector: "Food & Beverage", style: "Authentic Rustic", scenario: "Product Demo" },
  { num: 9, title: "Fitness Tracker Launch", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Launch" },
  { num: 10, title: "Electric SUV Reveal", sector: "Automotive", style: "Futuristic Tech", scenario: "Product Launch" },
  { num: 11, title: "Wireless Earbuds Pro", sector: "Consumer Electronics", style: "Modern Minimalist", scenario: "Product Demo" },
  { num: 12, title: "Luxury Perfume Launch", sector: "Health & Beauty", style: "Elegant Luxe", scenario: "Product Launch" },
  { num: 13, title: "Gourmet Chocolate Collection", sector: "Food & Beverage", style: "Elegant Luxe", scenario: "Product Demo" },
  { num: 14, title: "Professional Tennis Racket", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Demo" },
  { num: 15, title: "Luxury Sports Car", sector: "Automotive", style: "Cinematic Hyperrealistic", scenario: "Product Launch" },
  { num: 16, title: "4K Smart TV Launch", sector: "Consumer Electronics", style: "Cinematic Hyperrealistic", scenario: "Product Launch" },
  { num: 17, title: "Premium Hair Care", sector: "Health & Beauty", style: "Natural Authentic", scenario: "Product Demo" },
  { num: 18, title: "Artisan Bakery Products", sector: "Food & Beverage", style: "Authentic Rustic", scenario: "Product Demo" },
  { num: 19, title: "Mountain Bike Launch", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Launch" },
  { num: 20, title: "Hybrid Vehicle Showcase", sector: "Automotive", style: "Modern Minimalist", scenario: "Product Demo" },
  { num: 21, title: "Gaming Laptop Pro", sector: "Consumer Electronics", style: "Futuristic Tech", scenario: "Product Launch" },
  { num: 22, title: "Natural Makeup Line", sector: "Health & Beauty", style: "Natural Authentic", scenario: "Product Launch" },
  { num: 23, title: "Premium Wine Collection", sector: "Food & Beverage", style: "Elegant Luxe", scenario: "Product Demo" },
  { num: 24, title: "Professional Golf Clubs", sector: "Sports & Fitness", style: "Aspirational Lifestyle", scenario: "Product Demo" },
  { num: 25, title: "Luxury Convertible", sector: "Automotive", style: "Aspirational Lifestyle", scenario: "Product Launch" },
  { num: 26, title: "Smart Watch Ultra", sector: "Consumer Electronics", style: "Modern Minimalist", scenario: "Product Launch" },
  { num: 27, title: "Spa Treatment Products", sector: "Health & Beauty", style: "Elegant Luxe", scenario: "Product Demo" },
  { num: 28, title: "Organic Tea Collection", sector: "Food & Beverage", style: "Natural Authentic", scenario: "Product Demo" },
  { num: 29, title: "Yoga Equipment Line", sector: "Sports & Fitness", style: "Natural Authentic", scenario: "Product Launch" },
  { num: 30, title: "Compact City Car", sector: "Automotive", style: "Modern Minimalist", scenario: "Product Launch" },
  { num: 31, title: "Professional Camera", sector: "Consumer Electronics", style: "Cinematic Hyperrealistic", scenario: "Product Launch" },
  { num: 32, title: "Anti-Aging Face Cream", sector: "Health & Beauty", style: "Elegant Luxe", scenario: "Product Demo" },
  { num: 33, title: "Gourmet Olive Oil", sector: "Food & Beverage", style: "Authentic Rustic", scenario: "Product Demo" },
  { num: 34, title: "Swimming Gear Pro", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Demo" },
  { num: 35, title: "Performance Motorcycle", sector: "Automotive", style: "Dynamic Action", scenario: "Product Launch" },
  { num: 36, title: "Tablet Pro Launch", sector: "Consumer Electronics", style: "Modern Minimalist", scenario: "Product Launch" },
  { num: 37, title: "Luxury Fragrance Set", sector: "Health & Beauty", style: "Elegant Luxe", scenario: "Product Launch" },
  { num: 38, title: "Premium Coffee Beans", sector: "Food & Beverage", style: "Aspirational Lifestyle", scenario: "Product Demo" },
  { num: 39, title: "Hiking Boots Launch", sector: "Sports & Fitness", style: "Authentic Rustic", scenario: "Product Launch" },
  { num: 40, title: "Family SUV Showcase", sector: "Automotive", style: "Aspirational Lifestyle", scenario: "Product Demo" },
  { num: 41, title: "Noise-Canceling Headphones", sector: "Consumer Electronics", style: "Modern Minimalist", scenario: "Product Demo" },
  { num: 42, title: "Vitamin Supplement Line", sector: "Health & Beauty", style: "Natural Authentic", scenario: "Product Launch" },
  { num: 43, title: "Artisan Cheese Selection", sector: "Food & Beverage", style: "Authentic Rustic", scenario: "Product Demo" },
  { num: 44, title: "Basketball Shoes Pro", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Launch" },
  { num: 45, title: "Electric Scooter Launch", sector: "Automotive", style: "Futuristic Tech", scenario: "Product Launch" },
  { num: 46, title: "Portable Speaker", sector: "Consumer Electronics", style: "Dynamic Action", scenario: "Product Demo" },
  { num: 47, title: "Men's Grooming Kit", sector: "Health & Beauty", style: "Modern Minimalist", scenario: "Product Demo" },
  { num: 48, title: "Premium Spirits", sector: "Food & Beverage", style: "Elegant Luxe", scenario: "Product Demo" },
  { num: 49, title: "Ski Equipment Launch", sector: "Sports & Fitness", style: "Dynamic Action", scenario: "Product Launch" },
  { num: 50, title: "Luxury Yacht Showcase", sector: "Automotive", style: "Aspirational Lifestyle", scenario: "Product Demo" }
];

async function importPrompts() {
  // Create database connection
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  const db = drizzle(connection);
  
  const promptsDir = "/home/ubuntu/prompts_20s";
  const files = fs.readdirSync(promptsDir).filter(f => f.startsWith("prompt_") && f.endsWith(".json")).sort();
  
  console.log(`Importing ${files.length} prompts...`);
  
  for (const file of files) {
    const filePath = path.join(promptsDir, file);
    const promptJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    // Extract prompt number from filename
    const promptNum = parseInt(file.replace("prompt_", "").replace(".json", ""));
    const metadata = PROMPT_METADATA.find(m => m.num === promptNum);
    
    if (!metadata) {
      console.log(`⚠ No metadata for prompt #${promptNum}, skipping...`);
      continue;
    }
    
    await db.insert(prompts).values({
      promptNumber: promptNum,
      title: metadata.title,
      description: `${metadata.title} - ${metadata.scenario}`,
      scenarioType: metadata.scenario,
      industrySector: metadata.sector,
      visualStyle: metadata.style,
      durationSeconds: 20,
      originalDuration: 20,
      promptJson: JSON.stringify(promptJson),
    });
    
    console.log(`✓ Imported prompt #${promptNum}: ${metadata.title}`);
  }
  
  await connection.end();
  console.log("\n✅ All prompts imported successfully!");
  process.exit(0);
}

importPrompts().catch(err => {
  console.error("❌ Error importing prompts:", err);
  process.exit(1);
});
