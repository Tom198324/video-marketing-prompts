import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Search, Download, GitCompare, Image as ImageIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { QualityBadge } from "@/components/QualityBadge";
import Header from "@/components/Header";
import Gallery from "./Gallery";

export default function Production() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [minQualityScore, setMinQualityScore] = useState<string>("all");
  const [maxDuration, setMaxDuration] = useState<string>("all");
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);

  // Determine active tab from URL
  const getActiveTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "prompts";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "prompts") {
      setLocation("/production");
    } else {
      setLocation(`/production?tab=${value}`);
    }
  };

  const { data: prompts, isLoading } = trpc.prompts.list.useQuery();

  const filteredPrompts = prompts?.filter((prompt: any) => {
    const matchesSearch =
      searchTerm === "" ||
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.sector.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = selectedSector === "all" || prompt.sector === selectedSector;
    const matchesStyle = selectedStyle === "all" || prompt.visualStyle === selectedStyle;
    const matchesQuality =
      minQualityScore === "all" || (prompt.qualityScore && prompt.qualityScore >= parseInt(minQualityScore));
    const matchesDuration =
      maxDuration === "all" || (prompt.duration && parseInt(prompt.duration) <= parseInt(maxDuration));

    return matchesSearch && matchesSector && matchesStyle && matchesQuality && matchesDuration;
  });

  const sectors = Array.from(new Set(prompts?.map((p: any) => p.sector) || []));
  const styles = Array.from(new Set(prompts?.map((p: any) => p.visualStyle) || []));

  const toggleComparison = (promptNumber: number) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(promptNumber)) {
        return prev.filter((n) => n !== promptNumber);
      }
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 prompts at a time");
        return prev;
      }
      return [...prev, promptNumber];
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      toast.error("Please select at least 2 prompts to compare");
      return;
    }
    setLocation(`/compare?prompts=${selectedForComparison.join(",")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-14 bg-transparent border-0 w-full justify-start gap-4">
              <TabsTrigger 
                value="prompts" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <Film className="h-4 w-4 mr-2" />
                Prompts Library
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Visual Gallery
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} className="w-full">
          {/* Prompts Library Tab */}
          <TabsContent value="prompts" className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Prompts Library</h1>
                <p className="text-slate-600">
                  Browse {prompts?.length || 0} professional video prompts for Sora 2, Veo 3, and Runway Gen-3
                </p>
              </div>
              <div className="flex gap-2">
                {selectedForComparison.length > 0 && (
                  <Button onClick={handleCompare} variant="default">
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare ({selectedForComparison.length})
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <a href="/documentation">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </a>
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Prompts</CardTitle>
                <CardDescription>Search by keyword or filter by industry sector, style, quality, and duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={String(sector)} value={String(sector)}>
                          {String(sector)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Styles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      {styles.map((style) => (
                        <SelectItem key={String(style)} value={String(style)}>
                          {String(style)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={minQualityScore} onValueChange={setMinQualityScore}>
                    <SelectTrigger>
                      <SelectValue placeholder="Min Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quality</SelectItem>
                      <SelectItem value="7">7+ (Good)</SelectItem>
                      <SelectItem value="8">8+ (Great)</SelectItem>
                      <SelectItem value="9">9+ (Excellent)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={maxDuration} onValueChange={setMaxDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Max Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      <SelectItem value="10">≤10s</SelectItem>
                      <SelectItem value="20">≤20s</SelectItem>
                      <SelectItem value="30">≤30s</SelectItem>
                    </SelectContent>
                  </Select>
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
                {filteredPrompts.map((prompt: any) => (
                  <Card key={prompt.promptNumber} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedForComparison.includes(prompt.promptNumber)}
                            onCheckedChange={() => toggleComparison(prompt.promptNumber)}
                          />
                          <Badge variant="secondary">#{prompt.promptNumber}</Badge>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <Badge>{prompt.sector}</Badge>
                          {prompt.qualityScore && <QualityBadge score={prompt.qualityScore} />}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      <CardDescription>{prompt.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Visual Style</span>
                        <Badge variant="outline">{prompt.visualStyle}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Duration</span>
                        <span className="font-medium">{prompt.duration}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/prompt/${prompt.promptNumber}`}>
                          <a>View Details</a>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600">No prompts found matching your criteria</p>
                </CardContent>
              </Card>
            )}
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
