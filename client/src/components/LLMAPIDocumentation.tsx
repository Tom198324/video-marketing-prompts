import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Code, Copy, Check, Zap, Shield, BookOpen, Rocket, Lightbulb, 
  FileCode, Terminal, AlertCircle, CheckCircle2, Info 
} from "lucide-react";
import { toast } from "sonner";

export default function LLMAPIDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">LLM API Integration</h2>
        <p className="text-lg text-slate-600">
          Complete guide to integrating video generation APIs with your JSON prompts
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="api-ref">API Reference</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <CardTitle>Introduction to Video Generation APIs</CardTitle>
              </div>
              <CardDescription>
                Learn how to use our JSON prompts with leading video generation platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Supported Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-indigo-200 bg-indigo-50">
                    <CardHeader>
                      <CardTitle className="text-lg">OpenAI Sora 2</CardTitle>
                      <CardDescription>
                        State-of-the-art text-to-video generation with exceptional quality
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Max duration: 60 seconds</li>
                        <li>• Resolution: up to 1920x1080</li>
                        <li>• Best for: Cinematic, narrative videos</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Google Veo 3</CardTitle>
                      <CardDescription>
                        High-fidelity video generation with advanced motion control
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Max duration: 120 seconds</li>
                        <li>• Resolution: up to 4K</li>
                        <li>• Best for: Product demos, explainers</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-pink-200 bg-pink-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Runway Gen-3</CardTitle>
                      <CardDescription>
                        Fast generation with excellent style consistency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Max duration: 30 seconds</li>
                        <li>• Resolution: up to 1920x1080</li>
                        <li>• Best for: Social media, ads</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Key Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Professional Quality</h4>
                      <p className="text-sm text-slate-600">
                        Generate broadcast-quality videos with precise camera control and cinematography
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">JSON-Based Prompts</h4>
                      <p className="text-sm text-slate-600">
                        Use structured JSON prompts for consistent, reproducible results
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Tone & Atmosphere Control</h4>
                      <p className="text-sm text-slate-600">
                        Fine-tune emotional arc and visual style with 120+ tone options
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Batch Processing</h4>
                      <p className="text-sm text-slate-600">
                        Generate multiple variations efficiently with API batch endpoints
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Getting Started</AlertTitle>
                <AlertDescription>
                  All platforms support our JSON prompt structure. Simply stringify your prompt object and pass it to the API.
                  Check the Quick Start tab for platform-specific examples.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder for other tabs - will be completed in next iteration */}
        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Setup</CardTitle>
              <CardDescription>Configure API keys and environment variables</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Authentication documentation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Examples</CardTitle>
              <CardDescription>Get started with basic video generation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Quick start examples coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Usage</CardTitle>
              <CardDescription>Structured outputs, streaming, and error handling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Advanced usage documentation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
              <CardDescription>Optimization tips and prompt engineering</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Best practices documentation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-ref" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Complete parameter documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">API reference documentation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
              <CardDescription>Platform-specific implementations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Integration examples coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
