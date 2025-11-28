import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Tone Examples Relocation", () => {
  const clientPagesDir = path.join(__dirname, "../client/src/pages");

  describe("ToneGuide Simplification", () => {
    it("should not have Tabs imports in ToneGuide", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      // Should not have TabsList or TabsTrigger (only simple imports are ok)
      expect(toneGuideContent).not.toContain("TabsList");
      expect(toneGuideContent).not.toContain("TabsTrigger");
    });

    it("should not import ToneExamples in ToneGuide", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).not.toContain('import ToneExamples');
    });

    it("should not have sticky sub-navigation in ToneGuide", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).not.toContain("sticky top-16");
      expect(toneGuideContent).not.toContain("Sticky Sub-Navigation");
    });

    it("should have only Tone Categories content in ToneGuide", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).toContain("Tone Guide");
      expect(toneGuideContent).toContain("CATEGORY_INFO");
      expect(toneGuideContent).toContain("emotional_positive");
    });
  });

  describe("PromptsStudio Enhancement", () => {
    it("should import ToneExamples in PromptsStudio", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('import ToneExamples from "./ToneExamples"');
    });

    it("should have Palette icon imported for Tone Examples tab", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("Palette");
    });

    it("should have 5 tabs in PromptsStudio", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('value="my-prompts"');
      expect(promptsStudioContent).toContain('value="customizer"');
      expect(promptsStudioContent).toContain('value="optimizer"');
      expect(promptsStudioContent).toContain('value="validator"');
      expect(promptsStudioContent).toContain('value="tone-examples"');
    });

    it("should have Tone Examples tab trigger in sub-navigation", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("Tone Examples");
      expect(promptsStudioContent).toContain('<Palette className="h-4 w-4 mr-2" />');
    });

    it("should have Tone Examples tab content", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('<TabsContent value="tone-examples">');
      expect(promptsStudioContent).toContain('<ToneExamples />');
    });

    it("should handle tone-examples in URL routing", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('if (tab === "tone-examples") return "tone-examples"');
    });
  });

  describe("Tab Order", () => {
    it("should have Tone Examples as the 5th tab (after Validator)", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      // Find positions of each tab
      const myPromptsPos = promptsStudioContent.indexOf('value="my-prompts"');
      const customizerPos = promptsStudioContent.indexOf('value="customizer"');
      const optimizerPos = promptsStudioContent.indexOf('value="optimizer"');
      const validatorPos = promptsStudioContent.indexOf('value="validator"');
      const toneExamplesPos = promptsStudioContent.indexOf('value="tone-examples"');
      
      // Verify order
      expect(myPromptsPos).toBeLessThan(customizerPos);
      expect(customizerPos).toBeLessThan(optimizerPos);
      expect(optimizerPos).toBeLessThan(validatorPos);
      expect(validatorPos).toBeLessThan(toneExamplesPos);
    });
  });

  describe("ToneExamples Component", () => {
    it("should still exist as a standalone component", () => {
      const toneExamplesExists = fs.existsSync(path.join(clientPagesDir, "ToneExamples.tsx"));
      expect(toneExamplesExists).toBe(true);
    });

    it("should not have Header in ToneExamples (embedded component)", () => {
      const toneExamplesContent = fs.readFileSync(path.join(clientPagesDir, "ToneExamples.tsx"), "utf-8");
      
      // Should not render Header since it's embedded
      expect(toneExamplesContent).not.toContain("<Header />");
    });
  });

  describe("Navigation Consistency", () => {
    it("should have sticky sub-navigation in PromptsStudio", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("sticky top-16");
      expect(promptsStudioContent).toContain("z-40");
      expect(promptsStudioContent).toContain("bg-white/95 backdrop-blur");
    });

    it("should have consistent tab styling across all 5 tabs", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      // Count occurrences of the active state styling
      const activeStyleCount = (promptsStudioContent.match(/data-\[state=active\]:border-b-2/g) || []).length;
      
      // Should have 5 tabs with this styling
      expect(activeStyleCount).toBeGreaterThanOrEqual(5);
    });
  });
});
