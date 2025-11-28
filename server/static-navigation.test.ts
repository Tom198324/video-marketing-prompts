import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Static Sub-Navigation Implementation", () => {
  const clientPagesDir = path.join(__dirname, "../client/src/pages");
  const componentsDir = path.join(__dirname, "../client/src/components");

  describe("Header Simplification", () => {
    it("should not have DropdownMenu imports in Header", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).not.toContain("DropdownMenu");
      expect(headerContent).not.toContain("DropdownMenuTrigger");
      expect(headerContent).not.toContain("DropdownMenuContent");
    });

    it("should have simple navigation links without dropdowns", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).toContain("Production");
      expect(headerContent).toContain("Prompts Studio");
      expect(headerContent).toContain("Templates");
      expect(headerContent).toContain("Tone Guide");
      expect(headerContent).toContain("Documentation");
    });
  });

  describe("Production Page Sub-Navigation", () => {
    it("should have sticky sub-navigation with tabs", () => {
      const productionContent = fs.readFileSync(path.join(clientPagesDir, "Production.tsx"), "utf-8");
      
      expect(productionContent).toContain("sticky top-16");
      expect(productionContent).toContain("z-40");
      expect(productionContent).toContain("bg-white/95 backdrop-blur");
    });

    it("should have Prompts Library and Visual Gallery tabs", () => {
      const productionContent = fs.readFileSync(path.join(clientPagesDir, "Production.tsx"), "utf-8");
      
      expect(productionContent).toContain("Prompts Library");
      expect(productionContent).toContain("Visual Gallery");
      expect(productionContent).toContain('value="prompts"');
      expect(productionContent).toContain('value="gallery"');
    });

    it("should have tab styling with border-bottom on active state", () => {
      const productionContent = fs.readFileSync(path.join(clientPagesDir, "Production.tsx"), "utf-8");
      
      expect(productionContent).toContain("data-[state=active]:border-b-2");
      expect(productionContent).toContain("data-[state=active]:border-primary");
    });
  });

  describe("Prompts Studio Page Sub-Navigation", () => {
    it("should have sticky sub-navigation with tabs", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("sticky top-16");
      expect(promptsStudioContent).toContain("z-40");
      expect(promptsStudioContent).toContain("bg-white/95 backdrop-blur");
    });

    it("should have all 4 sub-page tabs", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("My Prompts");
      expect(promptsStudioContent).toContain("Customizer");
      expect(promptsStudioContent).toContain("Optimizer");
      expect(promptsStudioContent).toContain("Validator");
    });

    it("should have correct tab values", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain('value="my-prompts"');
      expect(promptsStudioContent).toContain('value="customizer"');
      expect(promptsStudioContent).toContain('value="optimizer"');
      expect(promptsStudioContent).toContain('value="validator"');
    });
  });

  describe("Tone Guide Page Sub-Navigation", () => {
    it("should have sticky sub-navigation with tabs", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).toContain("sticky top-16");
      expect(toneGuideContent).toContain("z-40");
      expect(toneGuideContent).toContain("bg-white/95 backdrop-blur");
    });

    it("should have Tone Categories and Tone Examples tabs", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).toContain("Tone Categories");
      expect(toneGuideContent).toContain("Tone Examples");
      expect(toneGuideContent).toContain('value="categories"');
      expect(toneGuideContent).toContain('value="examples"');
    });
  });

  describe("URL Synchronization", () => {
    it("Production should handle tab URL params", () => {
      const productionContent = fs.readFileSync(path.join(clientPagesDir, "Production.tsx"), "utf-8");
      
      expect(productionContent).toContain("getActiveTab");
      expect(productionContent).toContain("handleTabChange");
      expect(productionContent).toContain("setLocation");
    });

    it("PromptsStudio should handle tab URL params", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("getActiveTab");
      expect(promptsStudioContent).toContain("handleTabChange");
      expect(promptsStudioContent).toContain("setLocation");
    });

    it("ToneGuide should handle tab URL params", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).toContain("getActiveTab");
      expect(toneGuideContent).toContain("handleTabChange");
      expect(toneGuideContent).toContain("setLocation");
    });
  });

  describe("Sticky Positioning", () => {
    const pages = ["Production.tsx", "PromptsStudio.tsx", "ToneGuide.tsx"];

    pages.forEach((pageName) => {
      it(`${pageName} should have sticky sub-nav positioned below main header`, () => {
        const pageContent = fs.readFileSync(path.join(clientPagesDir, pageName), "utf-8");
        
        // Should be sticky at top-16 (below 64px header)
        expect(pageContent).toContain("sticky top-16");
        
        // Should have high z-index to stay above content
        expect(pageContent).toContain("z-40");
        
        // Should have backdrop blur for visual separation
        expect(pageContent).toContain("backdrop-blur");
      });
    });
  });

  describe("Visual Styling", () => {
    const pages = ["Production.tsx", "PromptsStudio.tsx", "ToneGuide.tsx"];

    pages.forEach((pageName) => {
      it(`${pageName} should have transparent tab list background`, () => {
        const pageContent = fs.readFileSync(path.join(clientPagesDir, pageName), "utf-8");
        
        expect(pageContent).toContain("bg-transparent");
      });

      it(`${pageName} should have border-bottom active indicator`, () => {
        const pageContent = fs.readFileSync(path.join(clientPagesDir, pageName), "utf-8");
        
        expect(pageContent).toContain("data-[state=active]:border-b-2");
        expect(pageContent).toContain("data-[state=active]:border-primary");
      });
    });
  });
});
