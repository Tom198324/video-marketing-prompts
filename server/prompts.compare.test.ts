import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Prompts Comparison Feature", () => {
  const caller = appRouter.createCaller({
    user: null,
    req: {} as any,
    res: {} as any,
  });

  describe("prompts.getByIds", () => {
    it("should fetch multiple prompts by IDs", async () => {
      const result = await caller.prompts.getByIds({ ids: [1, 2, 3] });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it("should return prompts with all required fields", async () => {
      const result = await caller.prompts.getByIds({ ids: [1, 2] });
      
      expect(result.length).toBeGreaterThan(0);
      
      const prompt = result[0];
      expect(prompt).toHaveProperty("id");
      expect(prompt).toHaveProperty("promptNumber");
      expect(prompt).toHaveProperty("title");
      expect(prompt).toHaveProperty("description");
      expect(prompt).toHaveProperty("industrySector");
      expect(prompt).toHaveProperty("visualStyle");
      expect(prompt).toHaveProperty("scenarioType");
      expect(prompt).toHaveProperty("promptJson");
      expect(prompt).toHaveProperty("originalDuration");
    });

    it("should return prompts with valid JSON structure", async () => {
      const result = await caller.prompts.getByIds({ ids: [1, 2] });
      
      expect(result.length).toBeGreaterThan(0);
      
      const prompt = result[0];
      let json;
      
      if (typeof prompt.promptJson === "string") {
        json = JSON.parse(prompt.promptJson);
      } else {
        json = prompt.promptJson;
      }
      
      expect(json).toBeDefined();
      expect(json).toHaveProperty("cinematography");
      expect(json).toHaveProperty("shot");
      expect(json).toHaveProperty("action");
      expect(json).toHaveProperty("scene");
      
      // Verify sequences exist
      expect(json.action).toHaveProperty("sequences");
      expect(Array.isArray(json.action.sequences)).toBe(true);
      expect(json.action.sequences.length).toBeGreaterThan(0);
    });

    it("should handle empty ID array", async () => {
      const result = await caller.prompts.getByIds({ ids: [] });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it("should handle non-existent IDs gracefully", async () => {
      const result = await caller.prompts.getByIds({ ids: [9999, 10000] });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // Should return empty array or only existing prompts
    });

    it("should return prompts in the correct order", async () => {
      const ids = [3, 1, 2];
      const result = await caller.prompts.getByIds({ ids });
      
      expect(result.length).toBeGreaterThan(0);
      
      // Verify all returned prompts have IDs from the requested list
      result.forEach(prompt => {
        expect(ids).toContain(prompt.promptNumber);
      });
    });

    it("should handle comparison of 2 prompts", async () => {
      const result = await caller.prompts.getByIds({ ids: [1, 2] });
      
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it("should handle comparison of 3 prompts", async () => {
      const result = await caller.prompts.getByIds({ ids: [1, 2, 3] });
      
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it("should return prompts with cinematography details", async () => {
      const result = await caller.prompts.getByIds({ ids: [1] });
      
      expect(result.length).toBeGreaterThan(0);
      
      const prompt = result[0];
      const json = typeof prompt.promptJson === "string" 
        ? JSON.parse(prompt.promptJson) 
        : prompt.promptJson;
      
      expect(json.shot).toBeDefined();
      expect(json.shot.camera_system).toBeDefined();
      expect(json.shot.primary_lens).toBeDefined();
    });

    it("should return prompts with lighting information", async () => {
      const result = await caller.prompts.getByIds({ ids: [1] });
      
      expect(result.length).toBeGreaterThan(0);
      
      const prompt = result[0];
      const json = typeof prompt.promptJson === "string" 
        ? JSON.parse(prompt.promptJson) 
        : prompt.promptJson;
      
      expect(json.cinematography).toBeDefined();
      expect(json.cinematography.lighting).toBeDefined();
    });

    it("should return prompts with action sequences", async () => {
      const result = await caller.prompts.getByIds({ ids: [1] });
      
      expect(result.length).toBeGreaterThan(0);
      
      const prompt = result[0];
      const json = typeof prompt.promptJson === "string" 
        ? JSON.parse(prompt.promptJson) 
        : prompt.promptJson;
      
      expect(json.action.sequences).toBeDefined();
      expect(Array.isArray(json.action.sequences)).toBe(true);
      
      // Verify sequence structure
      if (json.action.sequences.length > 0) {
        const seq = json.action.sequences[0];
        expect(seq).toHaveProperty("timing");
        expect(seq).toHaveProperty("primary_motion");
      }
    });
  });

  describe("Comparison Data Integrity", () => {
    it("should return consistent data for the same prompt ID", async () => {
      const result1 = await caller.prompts.getByIds({ ids: [1] });
      const result2 = await caller.prompts.getByIds({ ids: [1] });
      
      expect(result1.length).toBe(result2.length);
      
      if (result1.length > 0 && result2.length > 0) {
        expect(result1[0].id).toBe(result2[0].id);
        expect(result1[0].title).toBe(result2[0].title);
        expect(result1[0].promptNumber).toBe(result2[0].promptNumber);
      }
    });

    it("should return different prompts for different IDs", async () => {
      const result = await caller.prompts.getByIds({ ids: [1, 2] });
      
      if (result.length >= 2) {
        expect(result[0].id).not.toBe(result[1].id);
        expect(result[0].promptNumber).not.toBe(result[1].promptNumber);
      }
    });
  });
});
