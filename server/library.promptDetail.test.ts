import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";

describe("Prompt Detail Features", () => {
  let testUserId: number;
  let testPromptId: number;
  let testEmail: string;

  beforeAll(async () => {
    // Create test user context
    testUserId = 1;
    testEmail = "test@example.com";
  });

  describe("Share by Email", () => {
    it("should reject invalid email format", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      await expect(
        caller.library.shareByEmail({
          promptId: 1,
          sharedWithEmail: "invalid-email",
          permission: "view",
        })
      ).rejects.toThrow();
    });

    it("should reject non-existent user email", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      await expect(
        caller.library.shareByEmail({
          promptId: 1,
          sharedWithEmail: "nonexistent@example.com",
          permission: "view",
        })
      ).rejects.toThrow("User not found");
    });
  });

  describe("Comments", () => {
    it("should add comment successfully", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      // First create a test prompt
      const promptResult = await caller.library.savePrompt({
        title: "Test Prompt for Comments",
        promptJson: { test: "data" },
        qualityScore: 8,
      });

      testPromptId = (promptResult as any).insertId || 1;

      const result = await caller.library.addComment({
        promptId: testPromptId,
        commentText: "This is a test comment",
      });

      expect(result).toEqual({ success: true });
    });

    it("should retrieve comments for prompt", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      const comments = await caller.library.getComments({
        promptId: testPromptId,
      });

      expect(Array.isArray(comments)).toBe(true);
    });
  });

  describe("Version History", () => {
    it("should save new version", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      const result = await caller.library.saveVersion({
        promptId: testPromptId,
        promptJson: { updated: "data", version: 2 },
      });

      expect(result).toEqual({ success: true });
    });

    it("should retrieve version history", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      const versions = await caller.library.getVersions({
        promptId: testPromptId,
      });

      expect(Array.isArray(versions)).toBe(true);
      if (versions.length > 0) {
        expect(versions[0]).toHaveProperty("promptVersions");
        expect(versions[0]).toHaveProperty("users");
      }
    });
  });

  describe("Sharing Management", () => {
    it("should get shared with list", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, name: "Test User", email: testEmail, role: "user" as const },
      });

      const shares = await caller.library.getSharedWith({
        promptId: testPromptId,
      });

      expect(Array.isArray(shares)).toBe(true);
    });
  });
});
