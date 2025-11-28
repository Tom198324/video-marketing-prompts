import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    avatar: null,
    role: "user",
  };

  return {
    user,
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as any,
  };
}

describe.sequential("Library Features", () => {
  let testFolderId: number;
  let testPromptId: number;

  describe.sequential("Folder Management", () => {
    it("should create a new folder", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const result = await caller.library.createFolder({ name: "Test Folder" });
      
      expect(result).toBeDefined();
      expect(result.name).toBe("Test Folder");
      testFolderId = result.id;
    });

    it("should list user folders", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const folders = await caller.library.getMyFolders();
      
      expect(Array.isArray(folders)).toBe(true);
      expect(folders.length).toBeGreaterThan(0);
      expect(folders.some(f => f.name === "Test Folder")).toBe(true);
    });

    it("should update folder name", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const result = await caller.library.updateFolder({
        id: testFolderId,
        name: "Updated Folder",
      });
      
      expect(result.name).toBe("Updated Folder");
    });
  });

  describe.sequential("Prompt Management", () => {
    it("should save a prompt to library", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const promptJson = {
        shot: { type: "Close-up", angle: "Eye-level" },
        subject: { age: 30, gender: "Female" },
        action: { sequences: [], duration: "5 seconds" },
        scene: { location: "Studio" },
        cinematography: { camera: "RED" },
        audio: { ambient_sound: "Quiet" },
        visual_rules: { realism: "High" },
        technical_specifications: { resolution: "4K", fps: 24 },
      };

      const result = await caller.library.savePrompt({
        title: "Test Prompt",
        promptJson,
        folderId: testFolderId,
        tags: "test, demo",
        qualityScore: 8,
      });

      expect(result).toBeDefined();
      expect(result.title).toBe("Test Prompt");
      expect(result.qualityScore).toBe(8);
      testPromptId = result.id;
    });

    it("should get user prompts", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const prompts = await caller.library.getMyPrompts({ folderId: testFolderId });
      
      expect(Array.isArray(prompts)).toBe(true);
      expect(prompts.length).toBeGreaterThan(0);
      expect(prompts.some(p => p.title === "Test Prompt")).toBe(true);
    });

    it("should search prompts by title", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const results = await caller.library.searchPrompts({ searchTerm: "Test" });
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.some(p => p.title === "Test Prompt")).toBe(true);
    });

    it("should update prompt", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const result = await caller.library.updatePrompt({
        id: testPromptId,
        title: "Updated Test Prompt",
        tags: "updated, test",
      });
      
      expect(result.title).toBe("Updated Test Prompt");
      expect(result.tags).toBe("updated, test");
    });
  });

  describe.sequential("Template Features", () => {
    it("should list all templates", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const templates = await caller.templates.list();
      
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it("should get templates by industry", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const templates = await caller.templates.getByIndustry({ industry: "E-commerce" });
      
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.every(t => t.industry === "E-commerce")).toBe(true);
    });

    it("should get template by ID", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const allTemplates = await caller.templates.list();
      
      if (allTemplates.length > 0) {
        const template = await caller.templates.getById({ id: allTemplates[0].id });
        expect(template).toBeDefined();
        expect(template?.id).toBe(allTemplates[0].id);
      }
    });
  });

  describe.sequential("Version Management", () => {
    it("should save a version", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const promptJson = {
        shot: { type: "Wide shot", angle: "Low angle" },
        subject: { age: 25, gender: "Male" },
        action: { sequences: [], duration: "6 seconds" },
        scene: { location: "Outdoor" },
        cinematography: { camera: "Sony" },
        audio: { ambient_sound: "Nature" },
        visual_rules: { realism: "Medium" },
        technical_specifications: { resolution: "1080p", fps: 30 },
      };

      const result = await caller.library.saveVersion({
        promptId: testPromptId,
        promptJson,
      });

      expect(result).toBeDefined();
      expect(result.promptId).toBe(testPromptId);
    });

    it("should get version history", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const versions = await caller.library.getVersions({ promptId: testPromptId });
      
      expect(Array.isArray(versions)).toBe(true);
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe.sequential("Cleanup", () => {
    it("should delete test prompt", async () => {
      if (!testPromptId) {
        console.log("Skipping cleanup: testPromptId not set");
        return;
      }
      const caller = appRouter.createCaller(createTestContext());
      await caller.library.deletePrompt({ id: testPromptId });
      
      const prompts = await caller.library.getMyPrompts({});
      expect(prompts.some(p => p.id === testPromptId)).toBe(false);
    });

    it("should delete test folder", async () => {
      if (!testFolderId) {
        console.log("Skipping cleanup: testFolderId not set");
        return;
      }
      const caller = appRouter.createCaller(createTestContext());
      await caller.library.deleteFolder({ id: testFolderId });
      
      const folders = await caller.library.getMyFolders();
      expect(folders.some(f => f.id === testFolderId)).toBe(false);
    });
  });
});
