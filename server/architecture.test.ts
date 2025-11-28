import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Site Architecture Reorganization", () => {
  const clientPagesDir = path.join(__dirname, "../client/src/pages");
  const componentsDir = path.join(__dirname, "../client/src/components");

  describe("Phase 1: Page Renaming", () => {
    it("should have renamed Prompts.tsx to Production.tsx", () => {
      const productionExists = fs.existsSync(path.join(clientPagesDir, "Production.tsx"));
      const promptsExists = fs.existsSync(path.join(clientPagesDir, "Prompts.tsx"));
      
      expect(productionExists).toBe(true);
      expect(promptsExists).toBe(false);
    });

    it("should have renamed Generator.tsx to Customizer.tsx", () => {
      const customizerExists = fs.existsSync(path.join(clientPagesDir, "Customizer.tsx"));
      const generatorExists = fs.existsSync(path.join(clientPagesDir, "Generator.tsx"));
      
      expect(customizerExists).toBe(true);
      expect(generatorExists).toBe(false);
    });

    it("should have renamed MyPrompts.tsx to PromptsStudio.tsx", () => {
      const promptsStudioExists = fs.existsSync(path.join(clientPagesDir, "PromptsStudio.tsx"));
      const myPromptsExists = fs.existsSync(path.join(clientPagesDir, "MyPrompts.tsx"));
      
      expect(promptsStudioExists).toBe(true);
      expect(myPromptsExists).toBe(false);
    });
  });

  describe("Phase 2: Sub-pages Integration", () => {
    it("should have Production.tsx with tab navigation", () => {
      const productionContent = fs.readFileSync(path.join(clientPagesDir, "Production.tsx"), "utf-8");
      
      expect(productionContent).toContain("Tabs");
      expect(productionContent).toContain('value="prompts"');
      expect(productionContent).toContain('value="gallery"');
    });

    it("should have PromptsStudio.tsx with tab navigation for sub-pages", () => {
      const promptsStudioContent = fs.readFileSync(path.join(clientPagesDir, "PromptsStudio.tsx"), "utf-8");
      
      expect(promptsStudioContent).toContain("Tabs");
      expect(promptsStudioContent).toContain("my-prompts");
      expect(promptsStudioContent).toContain("customizer");
      expect(promptsStudioContent).toContain("optimizer");
      expect(promptsStudioContent).toContain("validator");
    });

    it("should have ToneGuide.tsx with ToneExamples as tab", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).toContain("Tabs");
      expect(toneGuideContent).toContain("categories");
      expect(toneGuideContent).toContain("examples");
      expect(toneGuideContent).toContain("ToneExamples");
    });

    it("should have created MyPromptsContent component", () => {
      const myPromptsContentExists = fs.existsSync(
        path.join(componentsDir, "studio/MyPromptsContent.tsx")
      );
      
      expect(myPromptsContentExists).toBe(true);
    });
  });

  describe("Phase 3: Navigation Structure", () => {
    it("should have updated Header.tsx with dropdown navigation", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).toContain("DropdownMenu");
      expect(headerContent).toContain("Production");
      expect(headerContent).toContain("Prompts Studio");
      expect(headerContent).toContain("Tone Guide");
      expect(headerContent).toContain("Documentation");
    });

    it("should have Production dropdown with correct sub-items", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).toContain("Prompts Library");
      expect(headerContent).toContain("Visual Gallery");
    });

    it("should have Prompts Studio dropdown with correct sub-items", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).toContain("My Prompts");
      expect(headerContent).toContain("Customizer");
      expect(headerContent).toContain("Optimizer");
      expect(headerContent).toContain("Validator");
    });

    it("should have Tone Guide dropdown with correct sub-items", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).toContain("Tone Categories");
      expect(headerContent).toContain("Tone Examples");
    });
  });

  describe("Phase 4: Header on All Pages", () => {
    const criticalPages = [
      "Production.tsx",
      "PromptsStudio.tsx",
      "Customizer.tsx",
      "Optimize.tsx",
      "Validator.tsx",
      "PromptDetail.tsx",
      "MyPromptDetail.tsx",
      "Compare.tsx",
      "BeforeAfter.tsx",
      "BatchValidator.tsx",
      "Templates.tsx",
      "ToneGuide.tsx",
      "Documentation.tsx",
    ];

    criticalPages.forEach((pageName) => {
      it(`should have Header in ${pageName}`, () => {
        const pagePath = path.join(clientPagesDir, pageName);
        if (fs.existsSync(pagePath)) {
          const pageContent = fs.readFileSync(pagePath, "utf-8");
          expect(pageContent).toContain("import Header from");
          expect(pageContent).toContain("<Header />");
        }
      });
    });
  });

  describe("Route Consistency", () => {
    it("should have App.tsx with updated routes", () => {
      const appPath = path.join(__dirname, "../client/src/App.tsx");
      const appContent = fs.readFileSync(appPath, "utf-8");
      
      expect(appContent).toContain("/production");
      expect(appContent).toContain("/prompts-studio");
      expect(appContent).toContain("/customizer");
    });

    it("should have legacy redirects for old routes", () => {
      const appPath = path.join(__dirname, "../client/src/App.tsx");
      const appContent = fs.readFileSync(appPath, "utf-8");
      
      // Legacy redirects should exist to avoid broken links
      expect(appContent).toContain('/prompts');
      expect(appContent).toContain('/generator');
      expect(appContent).toContain('/my-prompts');
      
      // New routes should also exist
      expect(appContent).toContain('/production');
      expect(appContent).toContain('/customizer');
      expect(appContent).toContain('/prompts-studio');
    });
  });
});
