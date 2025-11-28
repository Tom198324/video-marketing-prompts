import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Download, Film, Search, GitCompare, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { QualityBadge } from "@/components/QualityBadge";
import Header from "@/components/Header";
import Gallery from "./Gallery";

export default function Production() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [minQualityScore, setMinQualityScore] = useState<string>("all");
  const [maxDuration, setMaxDuration] = useState<string>("all");
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [, setLocation] = useLocation();

  const toggleComparison = (promptNumber: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(promptNumber)) {
        return prev.filter(id => id !== promptNumber);
      } else {
        if (prev.length >= 3) {
          toast.error("You can only compare up to 3 prompts at a time");
          return prev;
        }
        return [...prev, promptNumber];
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      toast.error("Please select at least 2 prompts to compare");
      return;
    }
    setLocation(`/compare?ids=${selectedForComparison.join(",")}`);
  };

  const { data: prompts, isLoading } = trpc.prompts.list.useQuery();
  const { data: stats } = trpc.prompts.getStats.useQuery();

  // Filter prompts
  const filteredPrompts = prompts?.filter(prompt => {
    const matchesSearch = searchTerm === "" || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = selectedSector === "all" || prompt.industrySector === selectedSector;
    const matchesStyle = selectedStyle === "all" || prompt.visualStyle === selectedStyle;
    
    const matchesQuality = minQualityScore === "all" || 
      (prompt.qualityScore !== null && prompt.qualityScore >= parseInt(minQualityScore));
    
    const matchesDuration = maxDuration === "all" || 
      prompt.durationSeconds <= parseInt(maxDuration);
    
    return matchesSearch && matchesSector && matchesStyle && matchesQuality && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Production</h1>
          <p className="text-slate-600">Browse our collection of professional video prompts and visual gallery</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="prompts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Prompts Library
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Visual Gallery
            </TabsTrigger>
          </TabsList>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-8">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
                <CardDescription>Find the perfect prompt for your video project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Industry Sector */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry Sector</label>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="All sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sectors</SelectItem>
                        {stats?.sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Visual Style */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Visual Style</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="All styles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All styles</SelectItem>
                        {stats?.styles.map((style) => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quality Score */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Quality Score</label>
                    <Select value={minQualityScore} onValueChange={setMinQualityScore}>
                      <SelectTrigger>
                        <SelectValue placeholder="All scores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All scores</SelectItem>
                        <SelectItem value="9">Gold (9+)</SelectItem>
                        <SelectItem value="7">Silver (7+)</SelectItem>
                        <SelectItem value="5">Bronze (5+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Duration</label>
                    <Select value={maxDuration} onValueChange={setMaxDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any duration</SelectItem>
                        <SelectItem value="10">≤ 10s</SelectItem>
                        <SelectItem value="15">≤ 15s</SelectItem>
                        <SelectItem value="20">≤ 20s</SelectItem>
                        <SelectItem value="30">≤ 30s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reset Filters */}
                {(searchTerm || selectedSector !== "all" || selectedStyle !== "all" || minQualityScore !== "all" || maxDuration !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSector("all");
                      setSelectedStyle("all");
                      setMinQualityScore("all");
                      setMaxDuration("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Comparison Bar */}
            {selectedForComparison.length > 0 && (
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCompare className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-indigo-900">
                        {selectedForComparison.length} prompt{selectedForComparison.length > 1 ? 's' : ''} selected for comparison
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedForComparison([])}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={handleCompare}
                        disabled={selectedForComparison.length < 2}
                      >
                        Compare Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                {isLoading ? "Loading..." : `${filteredPrompts?.length || 0} prompts found`}
              </p>
            </div>

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts?.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                          #{prompt.promptNumber}
                        </span>
                        {prompt.qualityScore !== null && (
                          <QualityBadge score={prompt.qualityScore} />
                        )}
                      </div>
                      <Checkbox
                        checked={selectedForComparison.includes(prompt.promptNumber)}
                        onCheckedChange={() => toggleComparison(prompt.promptNumber)}
                      />
                    </div>
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          {prompt.industrySector}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {prompt.visualStyle}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {prompt.durationSeconds}s
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/prompt/${prompt.promptNumber}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const blob = new Blob([prompt.promptJson], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `prompt_${prompt.promptNumber}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Gallery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
