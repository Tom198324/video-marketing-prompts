import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Download, Film, Search, GitCompare } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { QualityBadge } from "@/components/QualityBadge";
import Header from "@/components/Header";

export default function Prompts() {
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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Film className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">Video Marketing Prompts</h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/gallery">
              <Button variant="ghost">Gallery</Button>
            </Link>
            <Link href="/documentation">
              <Button variant="ghost">Documentation</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Explore Prompts</h2>
          <p className="text-lg text-slate-600">
            Browse our collection of {prompts?.length || 50} professional video marketing prompts
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>Refine your search by keywords, sector, style, quality score, and duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sector Filter */}
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sectors</SelectItem>
                  {stats?.sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Style Filter */}
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="All styles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All styles</SelectItem>
                  {stats?.styles.map(style => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quality Score Filter */}
              <Select value={minQualityScore} onValueChange={setMinQualityScore}>
                <SelectTrigger>
                  <SelectValue placeholder="All quality levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All quality levels</SelectItem>
                  <SelectItem value="9">Gold (9-10/10)</SelectItem>
                  <SelectItem value="7">Silver+ (7-10/10)</SelectItem>
                  <SelectItem value="5">Bronze+ (5-10/10)</SelectItem>
                </SelectContent>
              </Select>

              {/* Duration Filter */}
              <Select value={maxDuration} onValueChange={setMaxDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="All durations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All durations</SelectItem>
                  <SelectItem value="10">≤ 10 seconds</SelectItem>
                  <SelectItem value="15">≤ 15 seconds</SelectItem>
                  <SelectItem value="20">≤ 20 seconds</SelectItem>
                  <SelectItem value="30">≤ 30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count & Compare Button */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {filteredPrompts && (
                  <p>
                    Showing <span className="font-semibold">{filteredPrompts.length}</span> prompt{filteredPrompts.length > 1 ? 's' : ''}
                    {(searchTerm || selectedSector !== "all" || selectedStyle !== "all" || minQualityScore !== "all" || maxDuration !== "all") && 
                      ` out of ${prompts?.length || 0} total`
                    }
                  </p>
                )}
              </div>
              {selectedForComparison.length > 0 && (
                <Button
                  onClick={handleCompare}
                  className="gap-2"
                  variant={selectedForComparison.length >= 2 ? "default" : "secondary"}
                >
                  <GitCompare className="h-4 w-4" />
                  Compare Selected ({selectedForComparison.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prompts Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading prompts...</p>
          </div>
        ) : filteredPrompts && filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedForComparison.includes(prompt.promptNumber)}
                        onCheckedChange={() => toggleComparison(prompt.promptNumber)}
                        className="mt-0.5"
                      />
                      <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        Prompt #{prompt.promptNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <QualityBadge score={prompt.qualityScore} size="sm" showLabel={false} />
                      <span className="text-xs text-slate-500">
                        {prompt.durationSeconds}s
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-slate-700">Sector:</span>
                      <span className="text-slate-600">{prompt.industrySector}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-slate-700">Style:</span>
                      <span className="text-slate-600">{prompt.visualStyle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-slate-700">Scenario:</span>
                      <span className="text-slate-600">{prompt.scenarioType}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/prompt/${prompt.promptNumber}`} className="flex-1">
                      <Button className="w-full" variant="default">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(prompt.promptJson);
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", `prompt_${prompt.promptNumber}.json`);
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 text-lg">No prompts match your search criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}