import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Database, Download, Film, Lock, Search, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

export default function Home() {
  const { data: stats } = trpc.prompts.getStats.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Professional Collection of 50 JSON Prompts
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Create Marketing Videos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Hyperrealistic</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive collection of 50 professional JSON prompts to generate 20-second marketing videos with Sora 2, Veo 3, and Runway Gen-3.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/production">
              <Button size="lg" className="text-lg">
                Explore Prompts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/documentation">
              <Button size="lg" variant="outline" className="text-lg">
                Documentation
              </Button>
            </Link>
            <a href="/prompts_enriched_v4.zip" download>
              <Button size="lg" variant="outline" className="text-lg border-green-600 text-green-600 hover:bg-green-50">
                <Download className="mr-2 h-5 w-5" />
                Download ZIP v4.0 (212 KB)
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-indigo-600">{stats.total}</CardTitle>
                <CardDescription>Available Prompts</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-purple-600">{stats.sectors.length}</CardTitle>
                <CardDescription>Covered Sectors</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-pink-600">{stats.styles.length}</CardTitle>
                <CardDescription>Visual Styles</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-blue-600">20s</CardTitle>
                <CardDescription>Standard Duration</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      )}

      {/* Examples Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Prompt Examples
            </h3>
            <p className="text-lg text-slate-600">
              Discover the professional quality of our JSON prompts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example 1 - Tech */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    Consumer Electronics
                  </span>
                  <span className="text-sm text-slate-500">20s</span>
                </div>
                <CardTitle className="text-lg">Premium Smartphone Launch</CardTitle>
                <CardDescription>
                  Style: Cinematic Hyperrealistic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">Shot:</span> Close-up of the slowly rotating smartphone
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Camera:</span> ARRI Alexa Mini LF + Zeiss Supreme Prime 50mm
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Resolution:</span> 4K (3840x2160) at 24fps
                  </div>
                </div>
                <Link href="/prompt/1">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Prompt
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Example 2 - Beauty */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Health & Beauty
                  </span>
                  <span className="text-sm text-slate-500">20s</span>
                </div>
                <CardTitle className="text-lg">Luxury Anti-Aging Serum</CardTitle>
                <CardDescription>
                  Style: Elegant Luxe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">Shot:</span> Close-up on serum application
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Camera:</span> RED Komodo 6K + Cooke S7/i 75mm
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Resolution:</span> 6K (6144x3240) at 24fps
                  </div>
                </div>
                <Link href="/prompt/2">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Prompt
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Example 3 - Food */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                    Food & Beverage
                  </span>
                  <span className="text-sm text-slate-500">20s</span>
                </div>
                <CardTitle className="text-lg">Premium Artisan Coffee</CardTitle>
                <CardDescription>
                  Style: Aspirational Lifestyle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">Shot:</span> Coffee preparation by expert barista
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Camera:</span> Sony Venice + Canon CN-E 85mm
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Resolution:</span> 6K (6048x4032) at 24fps
                  </div>
                </div>
                <Link href="/prompt/3">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Prompt
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/production">
              <Button size="lg" variant="outline">
                View All Prompts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Key Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <Database className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Professional Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Each prompt contains 8 mandatory sections: shot, subject, action, scene, cinematography, audio, visual_rules, and technical_specifications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Filter by industry sector, visual style, scenario type, or search by keywords to find the perfect prompt.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-12 w-12 text-pink-600 mb-4" />
              <CardTitle>Flexible Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Download prompts individually in JSON, or export complete collections as ZIP for your workflow.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-4xl font-bold">
              Ready to Create Outstanding Videos?
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Access the complete collection of professional prompts and start generating hyperrealistic marketing videos today.
            </CardDescription>
            <div className="pt-4">
              <Link href="/production">
                <Button size="lg" variant="secondary" className="text-lg">
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>© 2025 Video Marketing Prompts - Professional Collection</p>
          <p className="text-sm mt-2">50 JSON prompts for Sora 2, Veo 3, and Runway Gen-3</p>
        </div>
      </footer>
    </div>
  );
}