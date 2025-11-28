import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Duplicate Headers Fix in Prompts Studio", () => {
  const clientPagesDir = path.join(__dirname, "../client/src/pages");

  describe("Customizer Component", () => {
    it("should not import Header", () => {
      const customizerContent = fs.readFileSync(path.join(clientPagesDir, "Customizer.tsx"), "utf-8");
      
      expect(customizerContent).not.toContain('import Header from "@/components/Header"');
    });

    it("should not render Header component", () => {
      const customizerContent = fs.readFileSync(path.join(clientPagesDir, "Customizer.tsx"), "utf-8");
      
      expect(customizerContent).not.toContain("<Header />");
    });

    it("should use space-y-8 wrapper instead of min-h-screen", () => {
      const customizerContent = fs.readFileSync(path.join(clientPagesDir, "Customizer.tsx"), "utf-8");
      
      expect(customizerContent).toContain('<div className="space-y-8">');
    });
  });

  describe("Optimize Component", () => {
    it("should not import Header", () => {
      const optimizeContent = fs.readFileSync(path.join(clientPagesDir, "Optimize.tsx"), "utf-8");
      
      expect(optimizeContent).not.toContain('import Header from "@/components/Header"');
    });

    it("should not render Header component", () => {
      const optimizeContent = fs.readFileSync(path.join(clientPagesDir, "Optimize.tsx"), "utf-8");
      
      expect(optimizeContent).not.toContain("<Header />");
    });

    it("should use space-y-8 wrapper instead of min-h-screen", () => {
      const optimizeContent = fs.readFileSync(path.join(clientPagesDir, "Optimize.tsx"), "utf-8");
      
      expect(optimizeContent).toContain('<div className="space-y-8">');
    });
  });

  describe("Validator Component", () => {
    it("should not import Header", () => {
      const validatorContent = fs.readFileSync(path.join(clientPagesDir, "Validator.tsx"), "utf-8");
      
      expect(validatorContent).not.toContain('import Header from "@/components/Header"');
    });

    it("should not render Header component", () => {
      const validatorContent = fs.readFileSync(path.join(clientPagesDir, "Validator.tsx"), "utf-8");
      
      expect(validatorContent).not.toContain("<Header />");
    });

    it("should use space-y-8 wrapper instead of min-h-screen", () => {
      const validatorContent = fs.readFileSync(path.join(clientPagesDir, "Validator.tsx"), "utf-8");
      
      expect(validatorContent).toContain('<div className="space-y-8">');
    });
  });

  describe("PromptsStudio Parent Component", () => {
    it("should have Header in PromptsStudio (parent component)", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('import Header from "@/components/Header"');
      expect(promptsStudioContent).toContain("<Header />");
    });

    it("should have sticky sub-navigation", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("sticky top-16");
    });

    it("should have all 5 tabs", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('value="my-prompts"');
      expect(promptsStudioContent).toContain('value="customizer"');
      expect(promptsStudioContent).toContain('value="optimizer"');
      expect(promptsStudioContent).toContain('value="validator"');
      expect(promptsStudioContent).toContain('value="tone-examples"');
    });
  });

  describe("Consistency Check", () => {
    it("should have only PromptsStudio with Header, not child components", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      const customizerContent = fs.readFileSync(path.join(clientPagesDir, "Customizer.tsx"), "utf-8");
      const optimizeContent = fs.readFileSync(path.join(clientPagesDir, "Optimize.tsx"), "utf-8");
      const validatorContent = fs.readFileSync(path.join(clientPagesDir, "Validator.tsx"), "utf-8");
      
      // Parent should have Header
      expect(promptsStudioContent).toContain("<Header />");
      
      // Children should NOT have Header
      expect(customizerContent).not.toContain("<Header />");
      expect(optimizeContent).not.toContain("<Header />");
      expect(validatorContent).not.toContain("<Header />");
    });

    it("should have all child components use space-y-8 wrapper", () => {
      const customizerContent = fs.readFileSync(path.join(clientPagesDir, "Customizer.tsx"), "utf-8");
      const optimizeContent = fs.readFileSync(path.join(clientPagesDir, "Optimize.tsx"), "utf-8");
      const validatorContent = fs.readFileSync(path.join(clientPagesDir, "Validator.tsx"), "utf-8");
      
      expect(customizerContent).toContain('<div className="space-y-8">');
      expect(optimizeContent).toContain('<div className="space-y-8">');
      expect(validatorContent).toContain('<div className="space-y-8">');
    });
  });

  describe("Other Embedded Components", () => {
    it("should verify ToneGuide also has no Header (embedded in Documentation)", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).not.toContain("<Header />");
    });

    it("should verify ToneExamples has no Header (embedded in PromptsStudio)", () => {
      const toneExamplesContent = fs.readFileSync(path.join(clientPagesDir, "ToneExamples.tsx"), "utf-8");
      
      expect(toneExamplesContent).not.toContain("<Header />");
    });

    it("should verify Gallery has no Header (embedded in Production)", () => {
      const galleryContent = fs.readFileSync(path.join(clientPagesDir, "Gallery.tsx"), "utf-8");
      
      expect(galleryContent).not.toContain("<Header />");
    });
  });
});
