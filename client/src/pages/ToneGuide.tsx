import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TONE_CATEGORIES } from "@/../../shared/promptStructure";
import { Search, Sparkles, Briefcase, Palette, TrendingUp, Heart, Zap, Users, Lightbulb, GraduationCap } from "lucide-react";
import Header from "@/components/Header";

type CategoryKey = keyof typeof TONE_CATEGORIES;

const CATEGORY_INFO: Record<CategoryKey, { 
  icon: any; 
  color: string; 
  bgColor: string;
  description: string;
  useCases: string[];
  sectors: string[];
}> = {
  emotional_positive: {
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50 border-pink-200",
    description: "Tones that evoke positive emotions like joy, hope, and celebration. Perfect for uplifting brand messages and feel-good content.",
    useCases: ["Brand celebrations", "Product launches", "Customer testimonials", "Holiday campaigns"],
    sectors: ["Lifestyle", "Entertainment", "Food & Beverage", "Travel"]
  },
  emotional_neutral: {
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    description: "Contemplative and reflective tones that create thoughtful, introspective atmospheres. Ideal for storytelling and emotional connection.",
    useCases: ["Brand storytelling", "Documentary-style content", "Heritage narratives", "Reflective campaigns"],
    sectors: ["Luxury goods", "Art & Culture", "Publishing", "Non-profits"]
  },
  emotional_intense: {
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    description: "Dramatic and powerful tones that create tension, suspense, and strong emotional impact. Perfect for bold, memorable campaigns.",
    useCases: ["Thriller campaigns", "High-stakes messaging", "Dramatic reveals", "Crisis communication"],
    sectors: ["Automotive", "Sports", "Gaming", "Action products"]
  },
  professional: {
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    description: "Corporate and authoritative tones that establish credibility and trust. Essential for B2B and professional services.",
    useCases: ["Corporate presentations", "B2B marketing", "Financial services", "Professional services"],
    sectors: ["Finance", "Consulting", "Legal", "Healthcare"]
  },
  creative_artistic: {
    icon: Palette,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
    description: "Artistic and cinematic tones that push creative boundaries. Perfect for brands that want to stand out with unique visual storytelling.",
    useCases: ["Art direction", "Fashion campaigns", "Creative showcases", "Experimental content"],
    sectors: ["Fashion", "Design", "Architecture", "Creative agencies"]
  },
  luxury_premium: {
    icon: Sparkles,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
    description: "Sophisticated and exclusive tones that convey premium quality and high-end positioning. Essential for luxury brands.",
    useCases: ["Luxury product launches", "Premium services", "Exclusive events", "High-end retail"],
    sectors: ["Luxury fashion", "Jewelry", "Automotive (premium)", "Hospitality"]
  },
  energetic_dynamic: {
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    description: "High-energy and vibrant tones that create excitement and momentum. Perfect for action-oriented campaigns and youth markets.",
    useCases: ["Sports marketing", "Fitness campaigns", "Youth products", "Event promotions"],
    sectors: ["Sports", "Fitness", "Energy drinks", "Technology"]
  },
  friendly_accessible: {
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    description: "Warm and approachable tones that create connection and relatability. Ideal for consumer brands and community-focused messaging.",
    useCases: ["Consumer products", "Community building", "Customer service", "Social campaigns"],
    sectors: ["Retail", "Food & Beverage", "Consumer tech", "Family products"]
  },
  innovative_modern: {
    icon: Lightbulb,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 border-cyan-200",
    description: "Forward-thinking and tech-savvy tones that position brands as innovators. Perfect for tech companies and disruptive brands.",
    useCases: ["Tech launches", "Innovation showcases", "Startup pitches", "Future-focused campaigns"],
    sectors: ["Technology", "SaaS", "Startups", "Innovation"]
  },
  educational: {
    icon: GraduationCap,
    color: "text-teal-600",
    bgColor: "bg-teal-50 border-teal-200",
    description: "Clear and engaging tones that facilitate learning and understanding. Essential for educational content and tutorials.",
    useCases: ["Tutorials", "Explainer videos", "Training content", "Educational campaigns"],
    sectors: ["Education", "E-learning", "Professional training", "How-to content"]
  }
};

export default function ToneGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all");

  // Build tone list with categories
  const toneList = Object.entries(TONE_CATEGORIES).flatMap(([category, tones]) =>
    tones.map(tone => ({ name: tone, category: category as CategoryKey }))
  );

  // Filter tones
  const filteredTones = toneList.filter((tone) => {
    const matchesSearch = tone.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tone.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900">Tone & Atmosphere Guide</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Master the art of emotional storytelling with our comprehensive guide to 200+ video tones. 
            Choose the perfect atmosphere to connect with your audience and elevate your marketing videos.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search tones... (e.g., 'cinematic', 'luxury', 'energetic')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(CATEGORY_INFO).map(([key, info]) => {
              const category = key as CategoryKey;
              const Icon = info.icon;
              const toneCount = TONE_CATEGORIES[category].length;
              
              return (
                <Card 
                  key={category}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category ? "ring-2 ring-primary" : ""
                  } ${info.bgColor}`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? "all" : category)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className={`h-6 w-6 ${info.color}`} />
                      <Badge variant="secondary">{toneCount} tones</Badge>
                    </div>
                    <CardTitle className="text-lg capitalize">
                      {category.replace(/_/g, ' ')}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {info.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">Best For:</p>
                        <div className="flex flex-wrap gap-1">
                          {info.sectors.slice(0, 3).map((sector, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">Use Cases:</p>
                        <ul className="text-xs text-slate-600 space-y-0.5">
                          {info.useCases.slice(0, 2).map((useCase, idx) => (
                            <li key={idx}>• {useCase}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* All Tones List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === "all" 
                  ? `All Tones (${filteredTones.length})`
                  : `${CATEGORY_INFO[selectedCategory].icon.name} ${selectedCategory.replace(/_/g, ' ')} (${filteredTones.length})`
                }
              </CardTitle>
              <CardDescription>
                {selectedCategory === "all"
                  ? "Browse all available tones or select a category above to filter"
                  : CATEGORY_INFO[selectedCategory].description
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredTones.map((tone) => {
                  const categoryInfo = CATEGORY_INFO[tone.category];
                  const Icon = categoryInfo.icon;
                  
                  return (
                    <div
                      key={`${tone.category}-${tone.name}`}
                      className={`p-3 rounded-lg border-2 ${categoryInfo.bgColor} hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${categoryInfo.color}`} />
                        <span className="font-semibold text-sm">{tone.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tone.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Pro Tips for Choosing Tones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">✓ Do:</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Combine 2-3 tones for nuanced atmospheres</li>
                    <li>• Match tone to your brand personality</li>
                    <li>• Consider your target audience's preferences</li>
                    <li>• Align tone with campaign objectives</li>
                    <li>• Test different tones for A/B testing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">✗ Avoid:</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Conflicting tones (e.g., "Playful" + "Somber")</li>
                    <li>• Generic tones without specificity</li>
                    <li>• Overusing trendy tones inappropriately</li>
                    <li>• Ignoring cultural context and sensitivity</li>
                    <li>• Copying competitors' tone without adaptation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
