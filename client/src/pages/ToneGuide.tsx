import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TONE_CATEGORIES } from "@/../../shared/promptStructure";
import { Search, Sparkles, Briefcase, Palette, TrendingUp, Heart, Zap, Users, GraduationCap } from "lucide-react";


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
    description: "Artistic and cinematic tones that emphasize visual storytelling and aesthetic beauty. Perfect for creative industries.",
    useCases: ["Film production", "Art exhibitions", "Fashion campaigns", "Creative portfolios"],
    sectors: ["Film & TV", "Fashion", "Design", "Photography"]
  },
  luxury_premium: {
    icon: Sparkles,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
    description: "Sophisticated and exclusive tones that convey prestige, elegance, and high-end positioning.",
    useCases: ["Luxury product launches", "Premium services", "Exclusive events", "High-end real estate"],
    sectors: ["Luxury Goods", "Jewelry", "Premium Automotive", "Fine Dining"]
  },
  energetic_dynamic: {
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    description: "High-energy tones that create excitement, movement, and vibrant atmospheres. Ideal for active brands.",
    useCases: ["Sports marketing", "Fitness campaigns", "Youth-oriented content", "Event promotions"],
    sectors: ["Sports", "Fitness", "Energy drinks", "Entertainment"]
  },
  friendly_accessible: {
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    description: "Warm and approachable tones that create connection and relatability. Perfect for community-focused brands.",
    useCases: ["Community building", "Customer service", "Family-oriented content", "Local business"],
    sectors: ["Retail", "Hospitality", "Community services", "Family products"]
  },
  innovative_modern: {
    icon: TrendingUp,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 border-cyan-200",
    description: "Forward-thinking tones that emphasize innovation, technology, and future-focused messaging.",
    useCases: ["Tech product launches", "Innovation showcases", "Startup pitches", "Future-focused campaigns"],
    sectors: ["Technology", "Startups", "Innovation", "Science"]
  },
  educational: {
    icon: GraduationCap,
    color: "text-teal-600",
    bgColor: "bg-teal-50 border-teal-200",
    description: "Informative and instructional tones that facilitate learning and knowledge transfer.",
    useCases: ["Training videos", "Educational content", "How-to guides", "Explainer videos"],
    sectors: ["Education", "E-learning", "Professional development", "Publishing"]
  }
};

export default function ToneGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all");

  // Filter tones based on search and category
  const getFilteredTones = () => {
    const categories = selectedCategory === "all" 
      ? Object.keys(TONE_CATEGORIES) as CategoryKey[]
      : [selectedCategory];

    return categories.map(category => ({
      category,
      tones: TONE_CATEGORIES[category].filter(tone =>
        tone.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(cat => cat.tones.length > 0);
  };

  const filteredCategories = getFilteredTones();

  return (
    <div className="space-y-8">

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tone Guide</h1>
          <p className="text-slate-600">Master the art of emotional storytelling with our comprehensive tone library</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Explore 120+ Professional Tones</CardTitle>
            <CardDescription>
              Search and filter tones by category to find the perfect emotional atmosphere for your video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tones (e.g., 'cinematic', 'professional', 'energetic')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              >
                All Categories
              </Badge>
              {(Object.keys(CATEGORY_INFO) as CategoryKey[]).map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map(({ category, tones }) => {
            const info = CATEGORY_INFO[category];
            const Icon = info.icon;

            return (
              <Card key={category} className={`${info.bgColor} border-2`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-white/50`}>
                      <Icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <CardTitle className="text-xl capitalize">
                      {category.replace(/_/g, " ")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {info.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tones List */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Available Tones ({tones.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {tones.map((tone) => (
                        <Badge key={tone} variant="secondary" className="text-xs">
                          {tone}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Common Use Cases</h4>
                    <ul className="text-sm space-y-1">
                      {info.useCases.map((useCase, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-slate-400">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Sectors */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Recommended Sectors</h4>
                    <div className="flex flex-wrap gap-2">
                      {info.sectors.map((sector) => (
                        <span key={sector} className="text-xs px-2 py-1 bg-white/50 rounded">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pro Tips */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Pro Tips for Choosing Tones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Match Your Audience</h4>
                <p className="text-sm text-slate-700">
                  Consider your target audience's demographics, psychographics, and emotional triggers. 
                  Younger audiences may respond better to energetic tones, while luxury buyers prefer sophisticated atmospheres.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Align with Brand Identity</h4>
                <p className="text-sm text-slate-700">
                  Your tone should reflect your brand's personality and values. A tech startup might use innovative tones, 
                  while a heritage brand benefits from nostalgic or professional atmospheres.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Consider Context & Platform</h4>
                <p className="text-sm text-slate-700">
                  Where and when your video will be viewed matters. Social media favors energetic and playful tones, 
                  while corporate presentations require professional and authoritative atmospheres.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Test & Iterate</h4>
                <p className="text-sm text-slate-700">
                  Don't be afraid to experiment with different tones. Use A/B testing to see which emotional atmosphere 
                  resonates best with your audience and drives the desired actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
