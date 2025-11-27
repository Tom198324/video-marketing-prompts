import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";

describe("Generator Optimization Procedures", () => {
  const caller = appRouter.createCaller({});

  describe("analyzePrompt", () => {
    it("should analyze a prompt and return coherence scores", async () => {
      // Use prompt #1 for testing
      const result = await caller.generator.analyzePrompt({ promptId: 1 });

      expect(result).toBeDefined();
      expect(result.promptId).toBe(1);
      expect(result.promptTitle).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(result.analysis.overall_score).toBeGreaterThanOrEqual(0);
      expect(result.analysis.overall_score).toBeLessThanOrEqual(10);
      expect(result.analysis.overall_assessment).toBeDefined();
      expect(result.analysis.section_scores).toBeDefined();
      expect(result.analysis.section_analysis).toBeDefined();
      expect(result.analysis.priority_improvements).toBeDefined();
      expect(Array.isArray(result.analysis.priority_improvements)).toBe(true);
    }, 60000); // 60s timeout for LLM call

    it("should have scores for multiple sections", async () => {
      const result = await caller.generator.analyzePrompt({ promptId: 1 });

      // Check that section_scores exists and has at least some sections
      expect(result.analysis.section_scores).toBeDefined();
      expect(typeof result.analysis.section_scores).toBe('object');
      const sectionCount = Object.keys(result.analysis.section_scores).length;
      expect(sectionCount).toBeGreaterThan(0);

      // Check that section_analysis exists
      expect(result.analysis.section_analysis).toBeDefined();
      expect(typeof result.analysis.section_analysis).toBe('object');
      
      // Verify at least one section has proper structure
      const firstSection = Object.keys(result.analysis.section_scores)[0];
      if (firstSection) {
        const score = result.analysis.section_scores[firstSection];
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(10);
      }
    }, 60000);

    it("should throw error for non-existent prompt", async () => {
      await expect(
        caller.generator.analyzePrompt({ promptId: 99999 })
      ).rejects.toThrow("Prompt not found");
    });
  });

  describe("optimizePrompt", () => {
    it("should generate an optimized version of the prompt", async () => {
      const result = await caller.generator.optimizePrompt({ promptId: 1 });

      expect(result).toBeDefined();
      expect(result.original).toBeDefined();
      expect(result.optimized).toBeDefined();

      // Check that optimized has all 8 sections
      expect(result.optimized.shot).toBeDefined();
      expect(result.optimized.subject).toBeDefined();
      expect(result.optimized.action).toBeDefined();
      expect(result.optimized.scene).toBeDefined();
      expect(result.optimized.cinematography).toBeDefined();
      expect(result.optimized.audio).toBeDefined();
      expect(result.optimized.visual_rules).toBeDefined();
      expect(result.optimized.technical_specifications).toBeDefined();
    }, 60000);

    it("should maintain the structure of the original prompt", async () => {
      const result = await caller.generator.optimizePrompt({ promptId: 1 });

      // Both should have the same top-level keys
      const originalKeys = Object.keys(result.original).sort();
      const optimizedKeys = Object.keys(result.optimized).sort();

      expect(optimizedKeys).toEqual(originalKeys);
    }, 60000);

    it("should throw error for non-existent prompt", async () => {
      await expect(
        caller.generator.optimizePrompt({ promptId: 99999 })
      ).rejects.toThrow("Prompt not found");
    });
  });
});
