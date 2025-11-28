import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Tone Guide in Documentation", () => {
  const clientPagesDir = path.join(__dirname, "../client/src/pages");
  const componentsDir = path.join(__dirname, "../client/src/components");

  describe("Header Simplification", () => {
    it("should not have Tone Guide in main navigation", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).not.toContain('"Tone Guide"');
      expect(headerContent).not.toContain('"/tone-guide"');
    });

    it("should not import Palette icon in Header", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).not.toContain("Palette");
    });

    it("should have exactly 4 navigation items", () => {
      const headerContent = fs.readFileSync(path.join(componentsDir, "Header.tsx"), "utf-8");
      
      expect(headerContent).toContain('"Production"');
      expect(headerContent).toContain('"Prompts Studio"');
      expect(headerContent).toContain('"Templates"');
      expect(headerContent).toContain('"Documentation"');
      
      // Count navigation items
      const navItems = headerContent.match(/{ name: "/g) || [];
      expect(navItems.length).toBe(4);
    });
  });

  describe("Documentation Page Structure", () => {
    it("should import ToneGuide component", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain('import ToneGuide from "./ToneGuide"');
    });

    it("should have sticky sub-navigation", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain("sticky top-16");
      expect(documentationContent).toContain("z-40");
      expect(documentationContent).toContain("bg-white/95 backdrop-blur");
    });

    it("should have 3 tabs in sub-navigation", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain('value="overview"');
      expect(documentationContent).toContain('value="llm-api"');
      expect(documentationContent).toContain('value="tone-guide"');
    });

    it("should have tab triggers with correct labels", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain("Overview");
      expect(documentationContent).toContain("LLM API");
      expect(documentationContent).toContain("Tone Guide");
    });

    it("should have tab triggers with icons", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain('<BookOpen className="h-4 w-4 mr-2" />');
      expect(documentationContent).toContain('<Code className="h-4 w-4 mr-2" />');
      expect(documentationContent).toContain('<Palette className="h-4 w-4 mr-2" />');
    });

    it("should have ToneGuide tab content", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain('<TabsContent value="tone-guide">');
      expect(documentationContent).toContain('<ToneGuide />');
    });

    it("should handle URL routing for tabs", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain("getActiveTab");
      expect(documentationContent).toContain("handleTabChange");
      expect(documentationContent).toContain('if (tab === "llm-api")');
      expect(documentationContent).toContain('if (tab === "tone-guide")');
    });
  });

  describe("Tab Order", () => {
    it("should have tabs in correct order (Overview, LLM API, Tone Guide)", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      const overviewPos = documentationContent.indexOf('value="overview"');
      const llmApiPos = documentationContent.indexOf('value="llm-api"');
      const toneGuidePos = documentationContent.indexOf('value="tone-guide"');
      
      expect(overviewPos).toBeLessThan(llmApiPos);
      expect(llmApiPos).toBeLessThan(toneGuidePos);
    });
  });

  describe("ToneGuide Component", () => {
    it("should not have Header in ToneGuide (embedded component)", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      // Should not render Header since it's embedded
      expect(toneGuideContent).not.toContain("<Header />");
    });

    it("should still have all tone categories content", () => {
      const toneGuideContent = fs.readFileSync(path.join(clientPagesDir, "ToneGuide.tsx"), "utf-8");
      
      expect(toneGuideContent).toContain("CATEGORY_INFO");
      expect(toneGuideContent).toContain("emotional_positive");
      expect(toneGuideContent).toContain("professional");
      expect(toneGuideContent).toContain("creative_artistic");
    });
  });

  describe("Navigation Consistency", () => {
    it("should have consistent tab styling across all 3 tabs", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      // Count occurrences of the active state styling
      const activeStyleCount = (documentationContent.match(/data-\[state=active\]:border-b-2/g) || []).length;
      
      // Should have at least 3 tabs with this styling
      expect(activeStyleCount).toBeGreaterThanOrEqual(3);
    });

    it("should use same sticky positioning as other pages", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      const productionContent = fs.readFileSync(path.join(clientPagesDir, "Production.tsx"), "utf-8");
      
      // Both should use sticky top-16
      expect(documentationContent).toContain("sticky top-16");
      expect(productionContent).toContain("sticky top-16");
    });
  });

  describe("URL Routing", () => {
    it("should default to overview tab when no query param", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain('return "overview"');
    });

    it("should update URL when switching tabs", () => {
      const documentationContent = fs.readFileSync(path.join(clientPagesDir, "Documentation.tsx"), "utf-8");
      
      expect(documentationContent).toContain('setLocation("/documentation")');
      expect(documentationContent).toContain('setLocation(`/documentation?tab=${value}`)');
    });
  });
});
