import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Film, Play, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

// Example demonstration videos
// Note: These URLs are placeholders. In production, replace with your real generated videos
const exampleVideos = [
  {
    id: 1,
    promptNumber: 1,
    title: "Premium Smartphone Launch",
    description: "28-year-old man presenting a new smartphone in a modern tech environment",
    sector: "Consumer Electronics",
    style: "Cinematic Hyperrealistic",
    platform: "Sora 2",
    thumbnailUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=450&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: "20s",
  },
  {
    id: 2,
    promptNumber: 2,
    title: "Luxury Anti-Aging Serum",
    description: "42-year-old woman applying a luxury serum in an elegant bathroom",
    sector: "Health & Beauty",
    style: "Elegant Luxe",
    platform: "Veo 3",
    thumbnailUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=450&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: "20s",
  },
  {
    id: 3,
    promptNumber: 15,
    title: "Modern Dental Clinic",
    description: "Professional dentist in a high-tech clinic with state-of-the-art equipment",
    sector: "Healthcare Services",
    style: "Cinematic Hyperrealistic",
    platform: "Runway Gen-3",
    thumbnailUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=450&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: "20s",
  },
  {
    id: 4,
    promptNumber: 8,
    title: "Gourmet Restaurant",
    description: "Chef presenting a signature dish in a professional kitchen",
    sector: "Food & Beverage",
    style: "Cinematic Hyperrealistic",
    platform: "Sora 2",
    thumbnailUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: "20s",
  },
  {
    id: 5,
    promptNumber: 22,
    title: "Premium Fitness Studio",
    description: "Fitness coach in a modern studio with high-end equipment",
    sector: "Fitness & Wellness",
    style: "Aspirational Lifestyle",
    platform: "Veo 3",
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: "20s",
  },
  {
    id: 6,
    promptNumber: 35,
    title: "Luxury Fashion Boutique",
    description: "Stylist presenting a collection in a design boutique",
    sector: "Fashion & Apparel",
    style: "Elegant Luxe",
    platform: "Runway Gen-3",
    thumbnailUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=450&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    duration: "20s",
  },
];

export default function Gallery() {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const sectors = Array.from(new Set(exampleVideos.map(v => v.sector)));
  const platforms = Array.from(new Set(exampleVideos.map(v => v.platform)));

  const filteredVideos = exampleVideos.filter(video => {
    const matchesSector = selectedSector === "all" || video.sector === selectedSector;
    const matchesPlatform = selectedPlatform === "all" || video.platform === selectedPlatform;
    return matchesSector && matchesPlatform;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            <Link href="/prompts">
              <Button variant="ghost">Explore</Button>
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
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Video Gallery</h2>
          <p className="text-lg text-slate-600">
            Discover examples of videos generated with our professional prompts
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Play className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Demo Videos</h3>
                <p className="text-sm text-slate-600">
                  These videos were generated using our JSON prompts with different platforms (Sora 2, Veo 3, Runway Gen-3). 
                  Each video demonstrates the quality and realism you can achieve using our professional prompts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your search by sector or platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="All platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredVideos.length}</span> video{filteredVideos.length > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-slate-200">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white rounded-full p-4 hover:scale-110 transition-transform"
                  >
                    <Play className="h-8 w-8 text-indigo-600" />
                  </a>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Prompt #{video.promptNumber}
                  </Badge>
                  <Badge className="text-xs bg-indigo-600">
                    {video.platform}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Sector:</span>
                    <span className="font-medium text-slate-900">{video.sector}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Style:</span>
                    <span className="font-medium text-slate-900">{video.style}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium text-slate-900">{video.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/prompt/${video.promptNumber}`} className="flex-1">
                    <Button variant="default" className="w-full" size="sm">
                      View Prompt
                    </Button>
                  </Link>
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 text-lg mb-4">No videos match your search criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSector("all");
                  setSelectedPlatform("all");
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardHeader className="text-center space-y-4 py-8">
            <CardTitle className="text-3xl">Create Your Own Videos</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Use our professional prompts to generate marketing videos of similar quality
            </CardDescription>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/prompts">
                <Button size="lg" variant="secondary">
                  Explore Prompts
                </Button>
              </Link>
              <Link href="/documentation">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  View Documentation
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}