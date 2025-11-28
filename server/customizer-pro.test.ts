import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Customizer Pro - Frontend Structure', () => {
  const customizerPath = path.join(__dirname, '../client/src/pages/Customizer.tsx');
  const customizerContent = fs.readFileSync(customizerPath, 'utf-8');

  it('should have mode selection (modify/create)', () => {
    expect(customizerContent).toContain('RadioGroup');
    expect(customizerContent).toContain('"modify"');
    expect(customizerContent).toContain('"create"');
    expect(customizerContent).toContain('Modify existing prompt');
    expect(customizerContent).toContain('Create from scratch');
  });

  it('should have mandatory fields (name and objectives)', () => {
    expect(customizerContent).toContain('promptName');
    expect(customizerContent).toContain('videoObjectives');
    expect(customizerContent).toContain('Prompt Name');
    expect(customizerContent).toContain('Video Objectives');
    expect(customizerContent).toContain('minimum 200 characters');
  });

  it('should have 9 section accordions', () => {
    expect(customizerContent).toContain('Accordion');
    expect(customizerContent).toContain('1. Tone & Atmosphere');
    expect(customizerContent).toContain('2. Character');
    expect(customizerContent).toContain('3. Location & Scene');
    expect(customizerContent).toContain('4. Cinematic Style');
    expect(customizerContent).toContain('5. Equipment');
    expect(customizerContent).toContain('6. Lighting');
    expect(customizerContent).toContain('7. Action & Sequences');
    expect(customizerContent).toContain('8. Audio');
    expect(customizerContent).toContain('9. Technical Specifications');
  });

  it('should have mandatory tone fields', () => {
    expect(customizerContent).toContain('primaryTone');
    expect(customizerContent).toContain('moodKeywords');
    expect(customizerContent).toContain('emotionalArc');
    expect(customizerContent).toContain('appearance');
    expect(customizerContent).toContain('clothing');
    expect(customizerContent).toContain('minimum 4');
  });

  it('should have optional character fields', () => {
    expect(customizerContent).toContain('charAge');
    expect(customizerContent).toContain('charGender');
    expect(customizerContent).toContain('charEthnicity');
    expect(customizerContent).toContain('charAppearance');
    expect(customizerContent).toContain('charClothing');
  });

  it('should have optional location fields', () => {
    expect(customizerContent).toContain('location');
    expect(customizerContent).toContain('time');
    expect(customizerContent).toContain('weather');
    expect(customizerContent).toContain('atmosphere');
  });

  it('should have optional cinematic fields', () => {
    expect(customizerContent).toContain('shotType');
    expect(customizerContent).toContain('angle');
    expect(customizerContent).toContain('framing');
    expect(customizerContent).toContain('movement');
  });

  it('should have optional action fields', () => {
    expect(customizerContent).toContain('movements');
    expect(customizerContent).toContain('actions');
    expect(customizerContent).toContain('sequencesTiming');
  });

  it('should have read-only AI sections with badges', () => {
    expect(customizerContent).toContain('AI-Generated Section');
    expect(customizerContent).toContain('Requires professional expertise');
    expect(customizerContent).toContain('automatically filled by AI');
  });

  it('should have status badges (Complete/Partial/Empty/AI Generated)', () => {
    expect(customizerContent).toContain('StatusBadge');
    expect(customizerContent).toContain('complete');
    expect(customizerContent).toContain('partial');
    expect(customizerContent).toContain('incomplete');
    expect(customizerContent).toContain('ai');
  });

  it('should have validation function', () => {
    expect(customizerContent).toContain('isMandatoryComplete');
    expect(customizerContent).toContain('videoObjectives.trim().length >= 200');
    expect(customizerContent).toContain('moodKeywords.filter');
  });

  it('should have generate button with validation', () => {
    expect(customizerContent).toContain('Generate Professional Prompt');
    expect(customizerContent).toContain('disabled={!isMandatoryComplete()');
    expect(customizerContent).toContain('Please complete all mandatory fields');
  });

  it('should have preview and export functionality', () => {
    expect(customizerContent).toContain('showPreview');
    expect(customizerContent).toContain('generatedPrompt');
    expect(customizerContent).toContain('Copy JSON');
    expect(customizerContent).toContain('Download JSON');
    expect(customizerContent).toContain('Send to Validator');
    expect(customizerContent).toContain('Save to My Prompts');
  });

  it('should call customizer.generatePrompt mutation', () => {
    expect(customizerContent).toContain('trpc.customizer.generatePrompt.useMutation');
    expect(customizerContent).toContain('generateMutation.mutate');
  });
});

describe('Customizer Pro - Backend Integration', () => {
  const routersPath = path.join(__dirname, './routers.ts');
  const routersContent = fs.readFileSync(routersPath, 'utf-8');

  it('should have customizer router', () => {
    expect(routersContent).toContain('customizer: router({');
  });

  it('should have generatePrompt procedure', () => {
    expect(routersContent).toContain('generatePrompt: publicProcedure');
  });

  it('should validate input schema', () => {
    expect(routersContent).toContain('mode: z.enum(["modify", "create"])');
    expect(routersContent).toContain('promptName: z.string()');
    expect(routersContent).toContain('videoObjectives: z.string()');
    expect(routersContent).toContain('userInputs: z.object({');
  });

  it('should have tone input schema (mandatory)', () => {
    expect(routersContent).toContain('tone: z.object({');
    expect(routersContent).toContain('primary: z.string()');
    expect(routersContent).toContain('moodKeywords: z.array(z.string())');
    expect(routersContent).toContain('emotionalArc: z.string()');
    expect(routersContent).toContain('appearance: z.string()');
    expect(routersContent).toContain('clothing: z.string()');
  });

  it('should have optional sections (character, location, cinematic, action)', () => {
    expect(routersContent).toContain('character: z.object({');
    expect(routersContent).toContain('.optional()');
    expect(routersContent).toContain('location: z.object({');
    expect(routersContent).toContain('cinematic: z.object({');
    expect(routersContent).toContain('action: z.object({');
  });

  it('should use LLM for generation', () => {
    expect(routersContent).toContain('invokeLLM');
    expect(routersContent).toContain('professional video production expert');
    expect(routersContent).toContain('Sora 2, Veo 3, and Runway Gen-3');
  });

  it('should have structured JSON output schema', () => {
    expect(routersContent).toContain('response_format');
    expect(routersContent).toContain('json_schema');
    expect(routersContent).toContain('tone');
    expect(routersContent).toContain('shot');
    expect(routersContent).toContain('subject');
    expect(routersContent).toContain('action');
    expect(routersContent).toContain('scene');
    expect(routersContent).toContain('cinematography');
    expect(routersContent).toContain('audio');
    expect(routersContent).toContain('visual');
    expect(routersContent).toContain('technical');
  });

  it('should generate Equipment section with AI', () => {
    expect(routersContent).toContain('cinematography');
    expect(routersContent).toContain('camera');
    expect(routersContent).toContain('lens');
    expect(routersContent).toContain('technical_specs');
  });

  it('should generate Lighting section with AI', () => {
    expect(routersContent).toContain('visual');
    expect(routersContent).toContain('lighting_setup');
    expect(routersContent).toContain('color_temperature');
    expect(routersContent).toContain('mood');
  });

  it('should generate Audio section with AI', () => {
    expect(routersContent).toContain('audio');
    expect(routersContent).toContain('music');
    expect(routersContent).toContain('sound_effects');
    expect(routersContent).toContain('dialogue');
  });

  it('should generate Technical Specifications with AI', () => {
    expect(routersContent).toContain('technical');
    expect(routersContent).toContain('resolution');
    expect(routersContent).toContain('fps');
    expect(routersContent).toContain('codec');
    expect(routersContent).toContain('aspect_ratio');
  });

  it('should return complete prompt structure', () => {
    expect(routersContent).toContain('return {');
    expect(routersContent).toContain('name: input.promptName');
    expect(routersContent).toContain('objectives: input.videoObjectives');
    expect(routersContent).toContain('prompt: generatedPrompt');
  });
});

describe('Customizer Pro - Professional Best Practices', () => {
  const routersPath = path.join(__dirname, './routers.ts');
  const routersContent = fs.readFileSync(routersPath, 'utf-8');

  it('should mention industry best practices in system prompt', () => {
    expect(routersContent).toContain('industry best practices');
    expect(routersContent).toContain('professional');
    expect(routersContent).toContain('production-ready');
  });

  it('should handle mandatory fields correctly', () => {
    expect(routersContent).toContain('Use the provided mandatory tone & atmosphere fields exactly as given');
  });

  it('should handle optional fields with AI fallback', () => {
    expect(routersContent).toContain('Enhance or generate professional defaults for optional fields');
    expect(routersContent).toContain('if not provided');
  });

  it('should generate complete technical sections', () => {
    expect(routersContent).toContain('Generate complete Equipment section');
    expect(routersContent).toContain('Generate complete Lighting section');
    expect(routersContent).toContain('Generate complete Audio section');
    expect(routersContent).toContain('Generate complete Technical Specifications');
  });
});
