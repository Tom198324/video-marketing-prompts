import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('LLMAPIDocumentation Integration', () => {
  const documentationPath = path.join(__dirname, '../client/src/pages/Documentation.tsx');
  const documentationContent = fs.readFileSync(documentationPath, 'utf-8');

  it('should import LLMAPIDocumentation component', () => {
    expect(documentationContent).toContain('import LLMAPIDocumentation from "@/components/LLMAPIDocumentation"');
  });

  it('should render LLMAPIDocumentation in llm-api tab', () => {
    expect(documentationContent).toContain('<TabsContent value="llm-api">');
    expect(documentationContent).toContain('<LLMAPIDocumentation />');
  });

  it('should not have "Coming Soon" placeholder anymore', () => {
    expect(documentationContent).not.toContain('Coming Soon');
    expect(documentationContent).not.toContain('We\'re working on integrating LLM APIs');
  });

  it('should have llm-api tab in TabsList', () => {
    expect(documentationContent).toContain('value="llm-api"');
    expect(documentationContent).toContain('LLM API');
  });

  it('should handle llm-api tab in URL routing', () => {
    expect(documentationContent).toContain('if (tab === "llm-api") return "llm-api"');
  });
});

describe('LLMAPIDocumentation Component Exists', () => {
  it('should have LLMAPIDocumentation.tsx file', () => {
    const componentPath = path.join(__dirname, '../client/src/components/LLMAPIDocumentation.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it('should export default function', () => {
    const componentPath = path.join(__dirname, '../client/src/components/LLMAPIDocumentation.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf-8');
    expect(componentContent).toContain('export default function LLMAPIDocumentation');
  });

  it('should have all 7 tabs', () => {
    const componentPath = path.join(__dirname, '../client/src/components/LLMAPIDocumentation.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf-8');
    
    expect(componentContent).toContain('value="overview"');
    expect(componentContent).toContain('value="auth"');
    expect(componentContent).toContain('value="quickstart"');
    expect(componentContent).toContain('value="advanced"');
    expect(componentContent).toContain('value="best-practices"');
    expect(componentContent).toContain('value="api-ref"');
    expect(componentContent).toContain('value="integration"');
  });
});
