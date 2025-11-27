-- Video Marketing Prompts - Database Import Script
-- This script imports all 50 English prompts into your production database
-- Run this in your PlanetScale console after creating the schema

-- Note: This is a template. The actual import should be done using the TypeScript script
-- or by uploading the JSON files through an admin interface.

-- For PlanetScale, you have two options:

-- OPTION 1: Use the TypeScript import script (Recommended)
-- 1. Install dependencies: pnpm install
-- 2. Set DATABASE_URL environment variable to your PlanetScale connection string
-- 3. Run: npx tsx scripts/import_english_prompts.ts

-- OPTION 2: Manual import via PlanetScale Console
-- 1. Go to your PlanetScale database console
-- 2. Use the "Import" feature to upload a CSV file
-- 3. Map the columns correctly

-- The prompts data is located in: /prompts_20s/ directory
-- Each prompt is a separate JSON file: prompt_01.json to prompt_50.json

-- Metadata for reference:
-- Prompt #1: Premium Smartphone Launch - Consumer Electronics - Cinematic Hyperrealistic
-- Prompt #2: Luxury Anti-Aging Serum - Health & Beauty - Elegant Luxe
-- Prompt #3: Premium Artisan Coffee - Food & Beverage - Aspirational Lifestyle
-- ... (50 prompts total)

-- After import, verify with:
-- SELECT COUNT(*) FROM prompts; -- Should return 50
-- SELECT id, promptNumber, title, industrySector FROM prompts LIMIT 10;
