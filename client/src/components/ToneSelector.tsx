import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TONE_CATEGORIES, ALL_TONES } from "@/../../shared/promptStructure";
import { Search, Sparkles, Briefcase, Palette, TrendingUp } from "lucide-react";

interface ToneSelectorProps {
  value: {
    primary_tone?: string;
    secondary_tone?: string;
    mood_keywords?: string[];
    emotional_arc?: string;
    visual_style_reference?: string;
  };
  onChange: (value: any) => void;
}

type CategoryKey = keyof typeof TONE_CATEGORIES;

const CATEGORY_COLORS: Record<CategoryKey, { bg: string; border: string; icon: any; label: string }> = {
  emotional_positive: { bg: "bg-pink-50", border: "border-pink-200", icon: Sparkles, label: "Emotional (Positive)" },
  emotional_neutral: { bg: "bg-purple-50", border: "border-purple-200", icon: Sparkles, label: "Emotional (Neutral)" },
  emotional_intense: { bg: "bg-red-50", border: "border-red-200", icon: Sparkles, label: "Emotional (Intense)" },
  professional: { bg: "bg-blue-50", border: "border-blue-200", icon: Briefcase, label: "Professional" },
  creative_artistic: { bg: "bg-indigo-50", border: "border-indigo-200", icon: Palette, label: "Creative & Artistic" },
  luxury_premium: { bg: "bg-amber-50", border: "border-amber-200", icon: Sparkles, label: "Luxury & Premium" },
  energetic_dynamic: { bg: "bg-orange-50", border: "border-orange-200", icon: TrendingUp, label: "Energetic & Dynamic" },
  friendly_accessible: { bg: "bg-green-50", border: "border-green-200", icon: Sparkles, label: "Friendly & Accessible" },
  innovative_modern: { bg: "bg-cyan-50", border: "border-cyan-200", icon: TrendingUp, label: "Innovative & Modern" },
  educational: { bg: "bg-teal-50", border: "border-teal-200", icon: Briefcase, label: "Educational" },
};

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all");

  // Build tone list with categories
  const toneList = Object.entries(TONE_CATEGORIES).flatMap(([category, tones]) =>
    tones.map(tone => ({ name: tone, category: category as CategoryKey }))
  );

  // Filter tones based on search and category
  const filteredTones = toneList.filter((tone) => {
    const matchesSearch = tone.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tone.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToneSelect = (toneName: string, isPrimary: boolean) => {
    if (isPrimary) {
      onChange({ ...value, primary_tone: toneName });
    } else {
      onChange({ ...value, secondary_tone: toneName });
    }
  };

  const handleMoodKeywordsChange = (keywords: string) => {
    const keywordArray = keywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
    onChange({ ...value, mood_keywords: keywordArray });
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            All Tones
          </Badge>
          {Object.keys(TONE_CATEGORIES).map((category) => {
            const cat = category as CategoryKey;
            const CategoryIcon = CATEGORY_COLORS[cat].icon;
            return (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                <CategoryIcon className="h-3 w-3 mr-1" />
                {CATEGORY_COLORS[cat].label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Selected Tones Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Primary Tone</Label>
          <div className="mt-2 p-4 border rounded-lg bg-muted/50">
            {value.primary_tone ? (
              <div className="flex items-center justify-between">
                <span className="font-medium">{value.primary_tone}</span>
                <button
                  onClick={() => onChange({ ...value, primary_tone: undefined })}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Select a primary tone below</span>
            )}
          </div>
        </div>

        <div>
          <Label>Secondary Tone (Optional)</Label>
          <div className="mt-2 p-4 border rounded-lg bg-muted/50">
            {value.secondary_tone ? (
              <div className="flex items-center justify-between">
                <span className="font-medium">{value.secondary_tone}</span>
                <button
                  onClick={() => onChange({ ...value, secondary_tone: undefined })}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Select a secondary tone below</span>
            )}
          </div>
        </div>
      </div>

      {/* Tone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredTones.map((tone) => {
          const categoryStyle = CATEGORY_COLORS[tone.category];
          const CategoryIcon = categoryStyle.icon;
          const isPrimary = value.primary_tone === tone.name;
          const isSecondary = value.secondary_tone === tone.name;
          const isSelected = isPrimary || isSecondary;

          return (
            <Card
              key={tone.name}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary" : ""
              } ${categoryStyle.bg} ${categoryStyle.border} border-2`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4" />
                    <h4 className="font-semibold text-sm">{tone.name}</h4>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      {isPrimary ? "Primary" : "Secondary"}
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {categoryStyle.label}
                </Badge>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToneSelect(tone.name, true)}
                    className="text-xs px-2 py-1 rounded bg-background hover:bg-accent"
                    disabled={isPrimary}
                  >
                    {isPrimary ? "✓ Primary" : "Set Primary"}
                  </button>
                  <button
                    onClick={() => handleToneSelect(tone.name, false)}
                    className="text-xs px-2 py-1 rounded bg-background hover:bg-accent"
                    disabled={isSecondary}
                  >
                    {isSecondary ? "✓ Secondary" : "Set Secondary"}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTones.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tones found matching your search.
        </div>
      )}

      {/* Additional Fields */}
      <div className="space-y-4 pt-4 border-t">
        <div>
          <Label htmlFor="mood-keywords">Mood Keywords (comma-separated)</Label>
          <Input
            id="mood-keywords"
            placeholder="elegant, sophisticated, luxurious, refined, exclusive"
            value={value.mood_keywords?.join(", ") || ""}
            onChange={(e) => handleMoodKeywordsChange(e.target.value)}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter 3-5 specific mood descriptors that support the chosen tone
          </p>
        </div>

        <div>
          <Label htmlFor="emotional-arc">Emotional Arc</Label>
          <Input
            id="emotional-arc"
            placeholder="Curiosity → Understanding → Empowerment"
            value={value.emotional_arc || ""}
            onChange={(e) => onChange({ ...value, emotional_arc: e.target.value })}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Define the emotional progression throughout the video (e.g., "Calm → Intrigued → Inspired")
          </p>
        </div>

        <div>
          <Label htmlFor="visual-style">Visual Style Reference (Optional)</Label>
          <Textarea
            id="visual-style"
            placeholder="Apple product launch aesthetic with minimalist precision"
            value={value.visual_style_reference || ""}
            onChange={(e) => onChange({ ...value, visual_style_reference: e.target.value })}
            className="mt-2"
            rows={2}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Reference a specific visual style or cinematic aesthetic
          </p>
        </div>
      </div>
    </div>
  );
}
