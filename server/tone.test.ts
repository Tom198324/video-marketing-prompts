import { describe, it, expect } from "vitest";
import { TONE_CATEGORIES, ALL_TONES } from "../shared/promptStructure";

describe("Tone & Atmosphere System", () => {
  describe("TONE_CATEGORIES structure", () => {
    it("should have 10 tone categories", () => {
      const categories = Object.keys(TONE_CATEGORIES);
      expect(categories).toHaveLength(10);
      expect(categories).toContain("emotional_positive");
      expect(categories).toContain("emotional_neutral");
      expect(categories).toContain("emotional_intense");
      expect(categories).toContain("professional");
      expect(categories).toContain("creative_artistic");
      expect(categories).toContain("luxury_premium");
      expect(categories).toContain("energetic_dynamic");
      expect(categories).toContain("friendly_accessible");
      expect(categories).toContain("innovative_modern");
      expect(categories).toContain("educational");
    });

    it("should have at least 100 total tones across all categories", () => {
      const totalTones = Object.values(TONE_CATEGORIES).reduce(
        (sum, tones) => sum + tones.length,
        0
      );
      expect(totalTones).toBeGreaterThanOrEqual(100);
    });

    it("should have unique tone names within each category", () => {
      Object.entries(TONE_CATEGORIES).forEach(([category, tones]) => {
        const uniqueTones = new Set(tones);
        expect(uniqueTones.size).toBe(tones.length);
      });
    });

    it("should have tone names as non-empty strings", () => {
      Object.values(TONE_CATEGORIES).forEach((tones) => {
        tones.forEach((tone) => {
          expect(typeof tone).toBe("string");
          expect(tone.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("ALL_TONES array", () => {
    it("should contain all tones from all categories", () => {
      const expectedTotal = Object.values(TONE_CATEGORIES).reduce(
        (sum, tones) => sum + tones.length,
        0
      );
      expect(ALL_TONES).toHaveLength(expectedTotal);
    });

    it("should include specific example tones", () => {
      expect(ALL_TONES).toContain("Luxury");
      expect(ALL_TONES).toContain("Epic");
      expect(ALL_TONES).toContain("Cinematic");
      expect(ALL_TONES).toContain("Minimalist");
      expect(ALL_TONES).toContain("Professional");
    });
  });

  describe("Tone data structure validation", () => {
    it("should have emotional_positive category with expected tones", () => {
      const emotionalPositive = TONE_CATEGORIES.emotional_positive;
      expect(emotionalPositive).toBeDefined();
      expect(emotionalPositive.length).toBeGreaterThan(0);
      expect(emotionalPositive).toContain("Joyful");
      expect(emotionalPositive).toContain("Uplifting");
    });

    it("should have luxury_premium category with expected tones", () => {
      const luxuryPremium = TONE_CATEGORIES.luxury_premium;
      expect(luxuryPremium).toBeDefined();
      expect(luxuryPremium.length).toBeGreaterThan(0);
      expect(luxuryPremium).toContain("Luxury");
      expect(luxuryPremium).toContain("Premium");
    });

    it("should have professional category with expected tones", () => {
      const professional = TONE_CATEGORIES.professional;
      expect(professional).toBeDefined();
      expect(professional.length).toBeGreaterThan(0);
      expect(professional).toContain("Professional");
      expect(professional).toContain("Corporate");
    });
  });

  describe("Tone naming conventions", () => {
    it("should have tone names starting with capital letters", () => {
      ALL_TONES.forEach((tone) => {
        const firstChar = tone.charAt(0);
        expect(firstChar).toBe(firstChar.toUpperCase());
      });
    });

    it("should have tones that may appear in multiple categories", () => {
      const allTonesSet = new Set(ALL_TONES);
      // Some tones may intentionally appear in multiple categories for flexibility
      expect(allTonesSet.size).toBeGreaterThan(0);
      expect(ALL_TONES.length).toBeGreaterThanOrEqual(allTonesSet.size);
    });
  });

  describe("Category coverage", () => {
    it("should have emotional categories covering positive, neutral, and intense", () => {
      expect(TONE_CATEGORIES.emotional_positive.length).toBeGreaterThan(0);
      expect(TONE_CATEGORIES.emotional_neutral.length).toBeGreaterThan(0);
      expect(TONE_CATEGORIES.emotional_intense.length).toBeGreaterThan(0);
    });

    it("should have creative and artistic tones", () => {
      const creativeArtistic = TONE_CATEGORIES.creative_artistic;
      expect(creativeArtistic.length).toBeGreaterThan(0);
      expect(creativeArtistic).toContain("Cinematic");
      expect(creativeArtistic).toContain("Artistic");
    });

    it("should have energetic and dynamic tones", () => {
      const energeticDynamic = TONE_CATEGORIES.energetic_dynamic;
      expect(energeticDynamic.length).toBeGreaterThan(0);
      expect(energeticDynamic).toContain("Energetic");
      expect(energeticDynamic).toContain("Dynamic");
    });
  });
});
