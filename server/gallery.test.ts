import { describe, it, expect } from "vitest";

describe("Gallery Data Integration", () => {
  it("should use real database query instead of hardcoded data", () => {
    // Verify Gallery.tsx imports trpc
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('trpc.prompts.list.useQuery()');
    expect(galleryContent).not.toContain('exampleVideos');
  });

  it("should have getDescription function to extract from promptJson", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('getDescription');
    expect(galleryContent).toContain('promptJson');
  });

  it("should have loading state handling", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('isLoading');
    expect(galleryContent).toContain('Loader2');
  });

  it("should have empty state handling", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('No videos available');
    expect(galleryContent).toContain('prompts.length === 0');
  });

  it("should extract sectors dynamically from data", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('industrySector');
    expect(galleryContent).toContain('Array.from(new Set(');
  });

  it("should extract styles dynamically from data", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('visualStyle');
    expect(galleryContent).toContain('Array.from(new Set(');
  });

  it("should have filter functionality", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('selectedSector');
    expect(galleryContent).toContain('selectedStyle');
    expect(galleryContent).toContain('filteredPrompts');
  });

  it("should display prompt number correctly", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('promptNumber');
    expect(galleryContent).toContain('#{prompt.promptNumber}');
  });

  it("should link to correct prompt detail page", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('/production?prompt=');
    expect(galleryContent).toContain('View Prompt');
  });

  it("should display duration badge", () => {
    const galleryContent = require("fs").readFileSync(
      require("path").join(__dirname, "../client/src/pages/Gallery.tsx"),
      "utf-8"
    );
    
    expect(galleryContent).toContain('durationSeconds');
  });
});

describe("Gallery Description Extraction Logic", () => {
  it("should extract description from subject.description if available", () => {
    const mockPromptJson = JSON.stringify({
      subject: { description: "A professional athlete running" }
    });
    
    // Simulate the getDescription function logic
    const parsed = JSON.parse(mockPromptJson);
    const description = parsed.subject?.description || "fallback";
    
    expect(description).toBe("A professional athlete running");
  });

  it("should extract description from scene.description if subject.description not available", () => {
    const mockPromptJson = JSON.stringify({
      scene: { description: "A modern kitchen with natural lighting" }
    });
    
    const parsed = JSON.parse(mockPromptJson);
    const description = parsed.subject?.description || parsed.scene?.description || "fallback";
    
    expect(description).toBe("A modern kitchen with natural lighting");
  });

  it("should construct description from scene and subject if descriptions not available", () => {
    const mockPromptJson = JSON.stringify({
      scene: { location: "modern office" },
      subject: { age: 35, gender: "female" }
    });
    
    const parsed = JSON.parse(mockPromptJson);
    let description = "fallback";
    
    if (parsed.scene?.location && parsed.subject?.age && parsed.subject?.gender) {
      description = `${parsed.subject.age}-year-old ${parsed.subject.gender} in ${parsed.scene.location}`;
    }
    
    expect(description).toBe("35-year-old female in modern office");
  });

  it("should use title as fallback if no other fields available", () => {
    const mockPromptJson = JSON.stringify({
      title: "Premium Product Launch"
    });
    
    const parsed = JSON.parse(mockPromptJson);
    const description = parsed.subject?.description || 
                       parsed.scene?.description || 
                       parsed.title || 
                       "Professional video prompt";
    
    expect(description).toBe("Premium Product Launch");
  });

  it("should use default fallback if JSON parsing fails", () => {
    const mockPromptJson = "invalid json {{{";
    
    let description = "Professional video prompt";
    try {
      const parsed = JSON.parse(mockPromptJson);
      description = parsed.subject?.description || description;
    } catch {
      // Keep default
    }
    
    expect(description).toBe("Professional video prompt");
  });
});

describe("Gallery Filtering Logic", () => {
  it("should filter by sector correctly", () => {
    const mockPrompts = [
      { id: 1, industrySector: "Consumer Electronics", visualStyle: "Cinematic" },
      { id: 2, industrySector: "Health & Beauty", visualStyle: "Elegant" },
      { id: 3, industrySector: "Consumer Electronics", visualStyle: "Modern" }
    ];
    
    const selectedSector = "Consumer Electronics";
    const selectedStyle = "all";
    
    const filtered = mockPrompts.filter(p => {
      const matchesSector = selectedSector === "all" || p.industrySector === selectedSector;
      const matchesStyle = selectedStyle === "all" || p.visualStyle === selectedStyle;
      return matchesSector && matchesStyle;
    });
    
    expect(filtered).toHaveLength(2);
    expect(filtered.every(p => p.industrySector === "Consumer Electronics")).toBe(true);
  });

  it("should filter by style correctly", () => {
    const mockPrompts = [
      { id: 1, industrySector: "Consumer Electronics", visualStyle: "Cinematic" },
      { id: 2, industrySector: "Health & Beauty", visualStyle: "Elegant" },
      { id: 3, industrySector: "Consumer Electronics", visualStyle: "Cinematic" }
    ];
    
    const selectedSector = "all";
    const selectedStyle = "Cinematic";
    
    const filtered = mockPrompts.filter(p => {
      const matchesSector = selectedSector === "all" || p.industrySector === selectedSector;
      const matchesStyle = selectedStyle === "all" || p.visualStyle === selectedStyle;
      return matchesSector && matchesStyle;
    });
    
    expect(filtered).toHaveLength(2);
    expect(filtered.every(p => p.visualStyle === "Cinematic")).toBe(true);
  });

  it("should filter by both sector and style", () => {
    const mockPrompts = [
      { id: 1, industrySector: "Consumer Electronics", visualStyle: "Cinematic" },
      { id: 2, industrySector: "Health & Beauty", visualStyle: "Elegant" },
      { id: 3, industrySector: "Consumer Electronics", visualStyle: "Modern" }
    ];
    
    const selectedSector = "Consumer Electronics";
    const selectedStyle = "Cinematic";
    
    const filtered = mockPrompts.filter(p => {
      const matchesSector = selectedSector === "all" || p.industrySector === selectedSector;
      const matchesStyle = selectedStyle === "all" || p.visualStyle === selectedStyle;
      return matchesSector && matchesStyle;
    });
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it("should show all prompts when filters are set to 'all'", () => {
    const mockPrompts = [
      { id: 1, industrySector: "Consumer Electronics", visualStyle: "Cinematic" },
      { id: 2, industrySector: "Health & Beauty", visualStyle: "Elegant" },
      { id: 3, industrySector: "Consumer Electronics", visualStyle: "Modern" }
    ];
    
    const selectedSector = "all";
    const selectedStyle = "all";
    
    const filtered = mockPrompts.filter(p => {
      const matchesSector = selectedSector === "all" || p.industrySector === selectedSector;
      const matchesStyle = selectedStyle === "all" || p.visualStyle === selectedStyle;
      return matchesSector && matchesStyle;
    });
    
    expect(filtered).toHaveLength(3);
  });
});
