import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pages = [
  'Prompts.tsx',
  'Gallery.tsx',
  'Generator.tsx',
  'Optimize.tsx',
  'Validator.tsx',
  'BatchValidator.tsx',
  'MyPrompts.tsx',
  'MyPromptDetail.tsx',
  'Templates.tsx',
  'Documentation.tsx',
  'ExcellenceGuide.tsx',
  'BeforeAfter.tsx',
  'PromptDetail.tsx',
];

const pagesDir = './client/src/pages';

for (const page of pages) {
  const filePath = join(pagesDir, page);
  try {
    let content = readFileSync(filePath, 'utf-8');
    
    // Skip if Header already imported
    if (content.includes('import Header from "@/components/Header"')) {
      console.log(`✓ ${page} already has Header`);
      continue;
    }
    
    // Add Header import after other imports
    const importMatch = content.match(/(import.*from.*;\n)+/);
    if (importMatch) {
      const lastImportIndex = importMatch[0].lastIndexOf('\n');
      const beforeImports = content.substring(0, importMatch.index + lastImportIndex + 1);
      const afterImports = content.substring(importMatch.index + lastImportIndex + 1);
      content = beforeImports + 'import Header from "@/components/Header";\n' + afterImports;
    }
    
    // Find the return statement and add Header after opening div
    const returnMatch = content.match(/return\s*\(\s*<(div|>)/);
    if (returnMatch) {
      // Find the first opening tag after return
      const afterReturn = content.substring(returnMatch.index);
      const firstTagMatch = afterReturn.match(/<(\w+)([^>]*)>/);
      
      if (firstTagMatch) {
        const tagName = firstTagMatch[1];
        const tagAttrs = firstTagMatch[2];
        const tagEnd = firstTagMatch.index + firstTagMatch[0].length;
        
        // Insert Header right after the opening tag
        const beforeTag = content.substring(0, returnMatch.index + tagEnd);
        const afterTag = content.substring(returnMatch.index + tagEnd);
        
        content = beforeTag + '\n      <Header />\n' + afterTag;
        
        writeFileSync(filePath, content, 'utf-8');
        console.log(`✓ Added Header to ${page}`);
      }
    }
  } catch (error) {
    console.error(`✗ Error processing ${page}:`, error.message);
  }
}

console.log('\n✅ Done!');
