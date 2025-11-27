import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Generator - generateVariation", () => {

  it("should generate multiple variations in batch", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.generator.generateVariation({
      promptId: 1,
      variations: {
        subject: true,
        location: true,
      },
      count: 3,
    });

    // Validate response structure for batch generation
    expect(result).toHaveProperty("original");
    expect(result).toHaveProperty("variations");
    expect(Array.isArray(result.variations)).toBe(true);
    expect(result.variations.length).toBe(3);

    // Validate each variation has unique ID and valid content
    const ids = result.variations.map((v) => v.id);
    expect(new Set(ids).size).toBe(3);

    result.variations.forEach((variation) => {
      expect(variation.id).toBeDefined();
      expect(variation.data).toBeDefined();
      expect(typeof variation.data).toBe("object");
      expect(variation.data.subject).toBeDefined();
      expect(variation.data.scene).toBeDefined();
    });

    console.log("✅ 3 variations generated successfully in batch");
  }, 90000); // 90 second timeout for multiple LLM calls

  it("should generate a single variation with modified subject, location, and style", async () => {
    // This test validates that the LLM integration works and returns a valid JSON structure
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.generator.generateVariation({
      promptId: 1, // Assuming prompt #1 exists in the database
      variations: {
        subject: true,
        location: true,
        style: true,
      },
      count: 1,
    });

    // Validate the response structure
    expect(result).toHaveProperty("original");
    expect(result).toHaveProperty("variations");
    expect(Array.isArray(result.variations)).toBe(true);
    expect(result.variations.length).toBe(1);

    const variation = result.variations[0].data;

    // Validate original prompt structure
    expect(result.original).toHaveProperty("shot");
    expect(result.original).toHaveProperty("subject");
    expect(result.original).toHaveProperty("action");
    expect(result.original).toHaveProperty("scene");
    expect(result.original).toHaveProperty("cinematography");
    expect(result.original).toHaveProperty("audio");
    expect(result.original).toHaveProperty("visual_rules");
    expect(result.original).toHaveProperty("technical_specifications");

    // Validate variation prompt structure
    expect(variation).toHaveProperty("shot");
    expect(variation).toHaveProperty("subject");
    expect(variation).toHaveProperty("action");
    expect(variation).toHaveProperty("scene");

    // Validate that variations were applied (values should be different)
    // Subject should be different
    expect(variation.subject).not.toEqual(result.original.subject);
    
    // Scene/location should be different
    expect(variation.scene).not.toEqual(result.original.scene);
    
    // Shot/style should be different
    expect(variation.shot).not.toEqual(result.original.shot);

    console.log("✅ Variation generated successfully");
    console.log("Original subject:", JSON.stringify(result.original.subject, null, 2));
    console.log("Variation subject:", JSON.stringify(variation.subject, null, 2));
  }, 60000); // 60 second timeout for LLM API call

  it("should fail when no prompt is found", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.generator.generateVariation({
        promptId: 99999, // Non-existent prompt
        variations: {
          subject: true,
        },
        count: 1,
      })
    ).rejects.toThrow("Prompt not found");
  });

  it("should generate variation with only equipment parameter", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.generator.generateVariation({
      promptId: 1,
      variations: {
        equipment: true,
      },
      count: 1,
    });

    expect(result).toHaveProperty("original");
    expect(result).toHaveProperty("variations");
    expect(Array.isArray(result.variations)).toBe(true);
    expect(result.variations.length).toBe(1);
    
    const variation = result.variations[0].data;
    
    // Equipment/shot details should be different
    expect(variation.shot).not.toEqual(result.original.shot);
    
    console.log("✅ Equipment variation generated successfully");
  }, 60000);
});
