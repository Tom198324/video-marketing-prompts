import { describe, it, expect } from "vitest";

describe("Save to My Prompts Feature", () => {
  describe("Frontend Structure", () => {
    it("should have Save button in Customizer export section", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain("Save to My Prompts");
      expect(customizerContent).toContain("handleSave");
    });

    it("should have Save Dialog component", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain("<Dialog open={showSaveDialog}");
      expect(customizerContent).toContain("DialogTitle>Save to My Prompts");
      expect(customizerContent).toContain("Tags (optional)");
    });

    it("should have tags input field", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain('placeholder="e.g., luxury, product-launch, automotive"');
      expect(customizerContent).toContain("saveTags");
    });

    it("should have handleConfirmSave function", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain("const handleConfirmSave = () => {");
      expect(customizerContent).toContain("saveMutation.mutate");
    });

    it("should have loading state during save", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain("saveMutation.isPending");
      expect(customizerContent).toContain("Saving...");
    });
  });

  describe("Backend Integration", () => {
    it("should have myPrompts router in routers.ts", () => {
      const routersContent = require("fs").readFileSync(
        "server/routers.ts",
        "utf-8"
      );
      
      expect(routersContent).toContain("myPrompts: router({");
    });

    it("should have saveFromCustomizer mutation", () => {
      const routersContent = require("fs").readFileSync(
        "server/routers.ts",
        "utf-8"
      );
      
      expect(routersContent).toContain("saveFromCustomizer: protectedProcedure");
      expect(routersContent).toContain("promptName: z.string().min(1)");
      expect(routersContent).toContain("promptJson: z.string()");
      expect(routersContent).toContain("tags: z.string().optional()");
    });

    it("should save to userPrompts table", () => {
      const routersContent = require("fs").readFileSync(
        "server/routers.ts",
        "utf-8"
      );
      
      expect(routersContent).toContain("db.insert(userPrompts)");
      expect(routersContent).toContain("userId: ctx.user.id");
      expect(routersContent).toContain("title: input.promptName");
      expect(routersContent).toContain("promptJson: input.promptJson");
    });

    it("should set qualityScore to null initially", () => {
      const routersContent = require("fs").readFileSync(
        "server/routers.ts",
        "utf-8"
      );
      
      expect(routersContent).toContain("qualityScore: null");
    });

    it("should return success and insertId", () => {
      const routersContent = require("fs").readFileSync(
        "server/routers.ts",
        "utf-8"
      );
      
      expect(routersContent).toContain("return { success: true, id: result.insertId }");
    });
  });

  describe("Database Schema", () => {
    it("should have userPrompts table with required fields", () => {
      const schemaContent = require("fs").readFileSync(
        "drizzle/schema.ts",
        "utf-8"
      );
      
      expect(schemaContent).toContain("export const userPrompts = mysqlTable");
      expect(schemaContent).toContain("userId: int(\"userId\").notNull()");
      expect(schemaContent).toContain("title: varchar(\"title\", { length: 255 }).notNull()");
      expect(schemaContent).toContain("promptJson: text(\"promptJson\").notNull()");
      expect(schemaContent).toContain("tags: text(\"tags\")");
      expect(schemaContent).toContain("qualityScore: int(\"qualityScore\")");
    });
  });

  describe("User Flow", () => {
    it("should have complete save workflow", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      // Step 1: Click Save button
      expect(customizerContent).toContain("onClick={handleSave}");
      
      // Step 2: Open dialog
      expect(customizerContent).toContain("setShowSaveDialog(true)");
      
      // Step 3: Enter tags (optional)
      expect(customizerContent).toContain("onChange={(e) => setSaveTags(e.target.value)}");
      
      // Step 4: Confirm save
      expect(customizerContent).toContain("onClick={handleConfirmSave}");
      
      // Step 5: Success toast
      expect(customizerContent).toContain("toast.success");
      expect(customizerContent).toContain("Prompt saved to My Prompts");
    });

    it("should handle save errors", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain("onError");
      expect(customizerContent).toContain("toast.error");
      expect(customizerContent).toContain("Save error");
    });

    it("should close dialog after successful save", () => {
      const customizerContent = require("fs").readFileSync(
        "client/src/pages/Customizer.tsx",
        "utf-8"
      );
      
      expect(customizerContent).toContain("setShowSaveDialog(false)");
      expect(customizerContent).toContain("setSaveTags(\"\")");
    });
  });
});
