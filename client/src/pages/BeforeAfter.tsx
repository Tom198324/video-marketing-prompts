import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { QualityBadge } from "@/components/QualityBadge";
import Header from "@/components/Header";

// Sample before/after examples showcasing optimization improvements
// In production, these would come from a database of optimization history
const examples = [
  {
    id: 5,
    title: "Luxury Sedan Launch",
    sector: "Automotive",
    before: {
      score: 3,
      issues: [
        "Generic placeholder sequences (\"Sequence 2\", \"Sequence 3\")",
        "Lack of automotive-specific actions",
        "Weak narrative progression",
        "Missing emotional crescendo"
      ]
    },
    after: {
      score: 9,
      improvements: [
        "Specific automotive actions (door close, engine start, acceleration)",
        "Cinematic camera movements (tracking, crane)",
        "Strong emotional progression (anticipation → power → luxury)",
        "Technical precision in all 8 sections"
      ]
    }
  },
  {
    id: 14,
    title: "Professional Tennis Racket",
    sector: "Fashion & Apparel",
    before: {
      score: 2,
      issues: [
        "Sector mismatch (Professional Services vs Sports Equipment)",
        "Generic product showcase sequences",
        "Lack of sports-specific cinematography",
        "Weak audio design"
      ]
    },
    after: {
      score: 9,
      improvements: [
        "Corrected sector alignment",
        "Dynamic sports action sequences",
        "Slow-motion impact moments",
        "Energetic audio with ball impact sounds"
      ]
    }
  },
  {
    id: 3,
    title: "Premium Artisan Coffee",
    sector: "Food & Beverage",
    before: {
      score: 4,
      issues: [
        "Missing technical specifications",
        "Incomplete visual rules",
        "Generic sequence descriptions",
        "Lack of sensory details"
      ]
    },
    after: {
      score: 10,
      improvements: [
        "Complete 4K technical specs (Rec. 2020, 10-bit)",
        "Detailed visual continuity rules",
        "Sensory-rich sequences (crema, steam, warmth)",
        "Cinematic focus pull and macro shots"
      ]
    }
  }
];

export default function BeforeAfter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Film className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-slate-900">Video Marketing Prompts</h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/production">
              <Button variant="ghost">Prompts</Button>
            </Link>
            <Link href="/optimize">
              <Button variant="ghost">Optimizer</Button>
            </Link>
            <Link href="/documentation">
              <Button variant="ghost">Documentation</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Before & After Gallery
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real examples of prompt transformations using our 8-section optimization methodology.
            See how coherence scores improve from 2-4/10 to 9-10/10.
          </p>
        </div>

        {/* Methodology Overview */}
        <Card className="mb-12 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl">Our Optimization Methodology</CardTitle>
            <CardDescription className="text-base">
              Each prompt is analyzed across 8 critical sections for coherence and quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "1. Shot",
                "2. Subject",
                "3. Action",
                "4. Scene",
                "5. Cinematography",
                "6. Audio",
                "7. Visual Rules",
                "8. Technical Specs"
              ].map((section) => (
                <div key={section} className="bg-white rounded-lg p-3 text-center font-medium text-sm shadow-sm">
                  {section}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <div className="space-y-8">
          {examples.map((example, index) => (
            <Card key={example.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{example.title}</CardTitle>
                    <CardDescription className="text-purple-100">
                      Prompt #{example.id} • {example.sector}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{example.before.score}</div>
                      <div className="text-xs opacity-90">Before</div>
                    </div>
                    <ArrowRight className="h-6 w-6" />
                    <div className="text-center">
                      <div className="text-3xl font-bold">{example.after.score}</div>
                      <div className="text-xs opacity-90">After</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">Before Optimization</h3>
                      <QualityBadge score={example.before.score} size="sm" />
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-3">Issues Identified:</h4>
                      <ul className="space-y-2">
                        {example.before.issues.map((issue, i) => (
                          <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">After Optimization</h3>
                      <QualityBadge score={example.after.score} size="sm" />
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        +{example.after.score - example.before.score} points
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-3">Improvements Made:</h4>
                      <ul className="space-y-2">
                        {example.after.improvements.map((improvement, i) => (
                          <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* View Prompt Button */}
                <div className="mt-6 pt-6 border-t flex justify-center">
                  <Link href={`/prompt/${example.id}`}>
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                      View Optimized Prompt #{example.id}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Optimize Your Prompts?</h3>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              Use our AI-powered Optimizer to analyze and improve any prompt with detailed
              section-by-section feedback and automatic optimization.
            </p>
            <Link href="/optimize">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
                Try the Optimizer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
