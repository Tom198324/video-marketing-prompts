import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Film, Play, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
// Header removed - Gallery is now embedded in Production

export default function Gallery() {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");

  // Fetch real prompts from database
  const { data: prompts, isLoading } = trpc.prompts.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <Film className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No videos available</h3>
        <p className="text-slate-600">Check back later for example videos</p>
      </div>
    );
  }

  // Extract unique sectors and styles from real data
  const sectors = Array.from(new Set(prompts.map(p => p.industrySector)));
  const styles = Array.from(new Set(prompts.map(p => p.visualStyle)));

  // Filter prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSector = selectedSector === "all" || prompt.industrySector === selectedSector;
    const matchesStyle = selectedStyle === "all" || prompt.visualStyle === selectedStyle;
    return matchesSector && matchesStyle;
  });

  // Helper function to extract description from promptJson
  const getDescription = (promptJson: string): string => {
    try {
      const parsed = JSON.parse(promptJson);
      // Try to extract meaningful description from JSON structure
      if (parsed.subject?.description) return parsed.subject.description;
      if (parsed.scene?.description) return parsed.scene.description;
      if (parsed.scene?.location && parsed.subject?.age && parsed.subject?.gender) {
        return `${parsed.subject.age}-year-old ${parsed.subject.gender} in ${parsed.scene.location}`;
      }
      return parsed.title || "Professional video prompt";
    } catch {
      return "Professional video prompt";
    }
  };

  // Helper function to get thumbnail (placeholder for now)
  const getThumbnail = (sector: string): string => {
    const thumbnails: Record<string, string> = {
      "Consumer Electronics": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=450&fit=crop",
      "Health & Beauty": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=450&fit=crop",
      "Healthcare Services": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=450&fit=crop",
      "Food & Beverage": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop",
      "Fitness & Wellness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
      "Fashion & Apparel": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=450&fit=crop",
      "Real Estate": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop",
      "Automotive": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=450&fit=crop",
      "Financial Services": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
      "Education": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop",
    };
    return thumbnails[sector] || "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=450&fit=crop";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Video Gallery</h2>
        <p className="text-slate-600">
          Explore example videos generated from our professional prompts
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-64">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger>
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-64">
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger>
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {styles.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Film className="h-4 w-4" />
          <span>{filteredPrompts.length} videos</span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map(prompt => (
          <Card key={prompt.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-video bg-slate-100">
              <img
                src={getThumbnail(prompt.industrySector)}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white rounded-full p-4 hover:bg-indigo-50 transition-colors">
                  <Play className="h-6 w-6 text-indigo-600" fill="currentColor" />
                </button>
              </div>
              <Badge className="absolute top-2 right-2 bg-indigo-600">
                {prompt.durationSeconds}s
              </Badge>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{prompt.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {getDescription(prompt.promptJson)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0">
                  #{prompt.promptNumber}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {prompt.industrySector}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {prompt.visualStyle}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Link href={`/production?prompt=${prompt.promptNumber}`} className="flex-1">
                  <button className="w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Prompt
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <Film className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No videos match your filters</h3>
          <p className="text-slate-600">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
}
