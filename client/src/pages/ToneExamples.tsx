import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Header from "@/components/Header";

// Example comparisons showing same product with different tones
const TONE_EXAMPLES = [
  {
    category: "Luxury vs. Energetic",
    product: "Premium Wireless Headphones",
    comparisons: [
      {
        tone: "Luxury",
        toneColor: "bg-amber-50 border-amber-200 text-amber-900",
        description: "Sophisticated, exclusive, refined atmosphere",
        prompt: {
          scene: "Minimalist studio with soft indirect lighting, marble surface",
          subject: "Elegant hand with manicured nails gently placing headphones",
          cinematography: "Slow dolly-in, shallow depth of field (f/1.4), cinematic color grading",
          audio: "Subtle classical piano, whisper-quiet ambient sound",
          emotional_arc: "Curiosity → Appreciation → Desire",
        },
        qualityScore: 9.2,
        impact: "Conveys premium positioning, appeals to affluent audience seeking status symbols",
      },
      {
        tone: "Energetic",
        toneColor: "bg-orange-50 border-orange-200 text-orange-900",
        description: "Dynamic, vibrant, high-energy atmosphere",
        prompt: {
          scene: "Urban rooftop at golden hour, city skyline background",
          subject: "Athletic person dancing with headphones, dynamic movement",
          cinematography: "Fast tracking shot, handheld camera, vibrant color grading",
          audio: "Upbeat electronic music, energetic sound effects",
          emotional_arc: "Excitement → Joy → Empowerment",
        },
        qualityScore: 8.8,
        impact: "Appeals to active lifestyle audience, emphasizes performance and fun",
      },
    ],
  },
  {
    category: "Cinematic vs. Minimalist",
    product: "Artisan Coffee Beans",
    comparisons: [
      {
        tone: "Cinematic",
        toneColor: "bg-indigo-50 border-indigo-200 text-indigo-900",
        description: "Dramatic, story-driven, emotionally rich",
        prompt: {
          scene: "Rustic coffee roastery at dawn, warm golden light streaming through windows",
          subject: "Master roaster carefully inspecting beans, weathered hands, focused expression",
          cinematography: "Anamorphic lens (2.39:1), slow-motion pour, dramatic lighting with lens flares",
          audio: "Orchestral score building emotion, crackling fire sounds, whispered narration",
          emotional_arc: "Intrigue → Connection → Reverence",
        },
        qualityScore: 9.5,
        impact: "Creates emotional connection through storytelling, emphasizes craftsmanship heritage",
      },
      {
        tone: "Minimalist",
        toneColor: "bg-slate-50 border-slate-200 text-slate-900",
        description: "Clean, simple, focused on essentials",
        prompt: {
          scene: "Pure white background, single spotlight from above",
          subject: "Coffee beans in geometric glass container, perfectly arranged",
          cinematography: "Static overhead shot, perfect symmetry, neutral color palette",
          audio: "Silence with subtle ASMR sounds of beans dropping",
          emotional_arc: "Calm → Focus → Clarity",
        },
        qualityScore: 8.6,
        impact: "Appeals to modern aesthetic sensibility, emphasizes purity and quality",
      },
    ],
  },
  {
    category: "Playful vs. Professional",
    product: "SaaS Project Management Tool",
    comparisons: [
      {
        tone: "Playful",
        toneColor: "bg-pink-50 border-pink-200 text-pink-900",
        description: "Fun, approachable, lighthearted atmosphere",
        prompt: {
          scene: "Colorful modern office with playful design elements, plants, bright colors",
          subject: "Diverse team laughing while collaborating, casual attire, animated gestures",
          cinematography: "Whip pans between screens, dynamic angles, saturated colors",
          audio: "Upbeat indie pop music, friendly voiceover with humor",
          emotional_arc: "Curiosity → Delight → Enthusiasm",
        },
        qualityScore: 8.4,
        impact: "Reduces intimidation factor, appeals to creative teams and startups",
      },
      {
        tone: "Professional",
        toneColor: "bg-blue-50 border-blue-200 text-blue-900",
        description: "Authoritative, credible, business-focused",
        prompt: {
          scene: "Corporate boardroom with glass walls, city view, professional lighting",
          subject: "Executive presenting dashboard on large screen, business attire, confident posture",
          cinematography: "Steady gimbal shots, corporate blue color grading, clean compositions",
          audio: "Subtle corporate music, clear professional narration",
          emotional_arc: "Attention → Understanding → Confidence",
        },
        qualityScore: 9.0,
        impact: "Establishes credibility with enterprise clients, emphasizes reliability and ROI",
      },
    ],
  },
  {
    category: "Nostalgic vs. Futuristic",
    product: "Electric Vehicle",
    comparisons: [
      {
        tone: "Nostalgic",
        toneColor: "bg-amber-50 border-amber-200 text-amber-900",
        description: "Warm, sentimental, heritage-focused",
        prompt: {
          scene: "Countryside road at sunset, vintage gas station in background, warm golden hour",
          subject: "Family of three generations admiring the car, emotional expressions",
          cinematography: "Film grain overlay, warm color grading, gentle camera movements",
          audio: "Acoustic guitar soundtrack, nostalgic voiceover about family journeys",
          emotional_arc: "Nostalgia → Connection → Hope",
        },
        qualityScore: 8.9,
        impact: "Bridges tradition with innovation, appeals to family-oriented buyers",
      },
      {
        tone: "Futuristic",
        toneColor: "bg-cyan-50 border-cyan-200 text-cyan-900",
        description: "Innovative, cutting-edge, tech-forward",
        prompt: {
          scene: "Sleek urban environment with LED lighting, modern architecture, night scene",
          subject: "Car with illuminated features, autonomous driving demonstration",
          cinematography: "Drone shots, CGI overlays showing technology, cool blue color grading",
          audio: "Electronic ambient music, tech-focused narration with data points",
          emotional_arc: "Intrigue → Amazement → Aspiration",
        },
        qualityScore: 9.3,
        impact: "Positions as innovation leader, appeals to early adopters and tech enthusiasts",
      },
    ],
  },
];

export default function ToneExamples() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleUseThisTone = (toneName: string) => {
    setLocation(`/generator?tone=${encodeURIComponent(toneName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Play className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900">Tone Examples & Comparisons</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            See how different tones transform the same product. Compare side-by-side examples to understand 
            the emotional and visual impact of tone selection on your marketing videos.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Category Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select a Comparison</CardTitle>
              <CardDescription>
                Choose a product category to see how different tones affect the video approach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TONE_EXAMPLES.map((example, idx) => (
                  <Button
                    key={idx}
                    variant={selectedCategory === idx ? "default" : "outline"}
                    className="h-auto py-4 px-4 text-left justify-start"
                    onClick={() => setSelectedCategory(idx)}
                  >
                    <div>
                      <div className="font-semibold">{example.category}</div>
                      <div className="text-xs opacity-80">{example.product}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Display */}
          {TONE_EXAMPLES[selectedCategory] && (
            <div className="space-y-6">
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-2xl">{TONE_EXAMPLES[selectedCategory].category}</CardTitle>
                  <CardDescription className="text-base">
                    Product: <strong>{TONE_EXAMPLES[selectedCategory].product}</strong>
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {TONE_EXAMPLES[selectedCategory].comparisons.map((comparison, idx) => (
                  <Card key={idx} className={`${comparison.toneColor} border-2`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default" className="text-sm">
                          {comparison.tone}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          Score: {comparison.qualityScore}/10
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{comparison.tone} Tone</CardTitle>
                      <CardDescription className="text-base font-medium">
                        {comparison.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Prompt Details */}
                      <div className="space-y-3">
                        <div className="bg-white/50 p-3 rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Scene</h4>
                          <p className="text-sm">{comparison.prompt.scene}</p>
                        </div>
                        
                        <div className="bg-white/50 p-3 rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Subject</h4>
                          <p className="text-sm">{comparison.prompt.subject}</p>
                        </div>
                        
                        <div className="bg-white/50 p-3 rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Cinematography</h4>
                          <p className="text-sm">{comparison.prompt.cinematography}</p>
                        </div>
                        
                        <div className="bg-white/50 p-3 rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Audio</h4>
                          <p className="text-sm">{comparison.prompt.audio}</p>
                        </div>
                        
                        <div className="bg-white/50 p-3 rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Emotional Arc</h4>
                          <p className="text-sm font-medium">{comparison.prompt.emotional_arc}</p>
                        </div>
                      </div>

                      {/* Marketing Impact */}
                      <div className="bg-white/70 p-4 rounded-lg border-2 border-current">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Marketing Impact
                        </h4>
                        <p className="text-sm">{comparison.impact}</p>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full"
                        onClick={() => handleUseThisTone(comparison.tone)}
                      >
                        Use This Tone in Generator
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Differences */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle>Key Differences Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/70 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Visual Style</h4>
                      <p className="text-sm text-slate-700">
                        {TONE_EXAMPLES[selectedCategory].comparisons[0].tone} uses {TONE_EXAMPLES[selectedCategory].comparisons[0].prompt.cinematography.split(',')[0].toLowerCase()}, 
                        while {TONE_EXAMPLES[selectedCategory].comparisons[1].tone} employs {TONE_EXAMPLES[selectedCategory].comparisons[1].prompt.cinematography.split(',')[0].toLowerCase()}.
                      </p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Emotional Journey</h4>
                      <p className="text-sm text-slate-700">
                        {TONE_EXAMPLES[selectedCategory].comparisons[0].tone} creates a {TONE_EXAMPLES[selectedCategory].comparisons[0].prompt.emotional_arc.toLowerCase()} progression, 
                        contrasting with {TONE_EXAMPLES[selectedCategory].comparisons[1].tone}'s {TONE_EXAMPLES[selectedCategory].comparisons[1].prompt.emotional_arc.toLowerCase()} arc.
                      </p>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Target Audience</h4>
                      <p className="text-sm text-slate-700">
                        Each tone appeals to different audience segments with distinct preferences, values, and emotional triggers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                How to Choose the Right Tone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Consider Your Audience</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• <strong>Demographics:</strong> Age, income, education level influence tone preferences</li>
                    <li>• <strong>Psychographics:</strong> Values, lifestyle, aspirations shape emotional resonance</li>
                    <li>• <strong>Context:</strong> Where and when they'll watch affects tone appropriateness</li>
                    <li>• <strong>Cultural factors:</strong> Regional and cultural norms impact tone perception</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Align with Brand Identity</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• <strong>Brand personality:</strong> Tone should reflect your brand's character</li>
                    <li>• <strong>Market positioning:</strong> Premium vs. accessible, traditional vs. innovative</li>
                    <li>• <strong>Competitive differentiation:</strong> Stand out from competitors' tone choices</li>
                    <li>• <strong>Consistency:</strong> Maintain tone coherence across all marketing touchpoints</li>
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
