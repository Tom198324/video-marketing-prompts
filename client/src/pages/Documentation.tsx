import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Code, BookOpen, Zap, Copy, Check, Palette } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import Header from "@/components/Header";
import ToneGuide from "./ToneGuide";

export default function Documentation() {
  const [location, setLocation] = useLocation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Determine active tab from URL
  const getActiveTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "llm-api") return "llm-api";
    if (tab === "tone-guide") return "tone-guide";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "overview") {
      setLocation("/documentation");
    } else {
      setLocation(`/documentation?tab=${value}`);
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const soraExample = `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load your JSON prompt
const promptData = {
  "shot": {
    "camera_system": "ARRI Alexa Mini LF",
    "primary_lens": "Zeiss Supreme Prime 50mm T1.5",
    // ... rest of the prompt
  }
};

async function generateVideo() {
  const response = await client.videos.generate({
    model: "sora-2",
    prompt: JSON.stringify(promptData),
    size: "1920x1080",
    duration: 20
  });
  
  console.log("Video generated:", response.url);
  return response;
}

generateVideo();`;

  const veoExample = `import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Load your JSON prompt
const promptData = {
  "shot": {
    "camera_system": "RED Komodo 6K",
    "primary_lens": "Cooke S7/i 50mm T2.0",
    // ... rest of the prompt
  }
};

async function generateVideo() {
  const model = genAI.getGenerativeModel({ model: 'veo-3' });
  
  const result = await model.generateContent({
    prompt: JSON.stringify(promptData),
    videoConfig: {
      duration: 20,
      resolution: '1920x1080',
      fps: 24
    }
  });
  
  console.log("Video generated:", result.response.videoUrl);
  return result;
}

generateVideo();`;

  const runwayExample = `import fetch from 'node-fetch';

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

// Load your JSON prompt
const promptData = {
  "shot": {
    "camera_system": "Sony Venice",
    "primary_lens": "Canon CN-E 50mm T1.3",
    // ... rest of the prompt
  }
};

async function generateVideo() {
  const response = await fetch('https://api.runwayml.com/v1/gen3/generate', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${RUNWAY_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: JSON.stringify(promptData),
      duration: 20,
      resolution: '1920x1080'
    })
  });
  
  const data = await response.json();
  console.log("Video generated:", data.videoUrl);
  return data;
}

generateVideo();`;

  const customizationExample = `// Example of customizing a prompt
const basePrompt = await fetch('/api/prompts/1').then(r => r.json());
const promptData = JSON.parse(basePrompt.promptJson);

// Customize the subject
promptData.subject.identity.age = "35 years";
promptData.subject.identity.gender = "Female";
promptData.subject.appearance.description = "Confident professional with short hair";

// Customize the scene
promptData.scene.location = "Modern office with city view";
promptData.scene.time_of_day = "Golden morning (8am-9am)";

// Customize the audio
promptData.audio.music = "Inspiring and dynamic corporate music";

// Use the customized prompt
console.log(JSON.stringify(promptData, null, 2));`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-14 bg-transparent border-0 w-full justify-start gap-4">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="llm-api" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <Code className="h-4 w-4 mr-2" />
                LLM API
              </TabsTrigger>
              <TabsTrigger 
                value="tone-guide" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <Palette className="h-4 w-4 mr-2" />
                Tone Guide
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} className="w-full">
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="max-w-6xl space-y-8">
              {/* Page Header */}
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Documentation</h2>
                <p className="text-lg text-slate-600">
                  Complete guides for using JSON prompts with Sora 2, Veo 3, and Runway Gen-3
                </p>
              </div>

              {/* Quick Start */}
              <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-indigo-600" />
                    <div>
                      <CardTitle className="text-2xl">Quick Start</CardTitle>
                      <CardDescription className="text-base">Start generating videos in 3 simple steps</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl mb-3">
                        1
                      </div>
                      <h3 className="font-semibold text-slate-900">Choose a Prompt</h3>
                      <p className="text-sm text-slate-600">
                        Browse our collection of 50 prompts and select the one that fits your marketing need.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-xl mb-3">
                        2
                      </div>
                      <h3 className="font-semibold text-slate-900">Download the JSON</h3>
                      <p className="text-sm text-slate-600">
                        Click the download button to get the full JSON file of the selected prompt.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-pink-600 text-white rounded-full font-bold text-xl mb-3">
                        3
                      </div>
                      <h3 className="font-semibold text-slate-900">Generate the Video</h3>
                      <p className="text-sm text-slate-600">
                        Use the prompt with your preferred platform (Sora 2, Veo 3, Runway Gen-3) to create your video.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Documentation Tabs */}
              <Tabs defaultValue="structure" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="sora">Sora 2</TabsTrigger>
                  <TabsTrigger value="veo">Veo 3</TabsTrigger>
                  <TabsTrigger value="runway">Runway</TabsTrigger>
                  <TabsTrigger value="custom">Customization</TabsTrigger>
                </TabsList>

                {/* Structure Tab */}
                <TabsContent value="structure" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                        <CardTitle>JSON Prompt Structure</CardTitle>
                      </div>
                      <CardDescription>
                        Each prompt contains 8 mandatory sections for professional video generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-l-4 border-indigo-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">1. Shot</h3>
                          <p className="text-sm text-slate-600">
                            Defines the camera system, lens, composition, camera movement, and technical shooting parameters.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-purple-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">2. Subject</h3>
                          <p className="text-sm text-slate-600">
                            Describes the subject's identity (age, gender), physical appearance, wardrobe, and emotional expression.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-pink-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">3. Action</h3>
                          <p className="text-sm text-slate-600">
                            Action sequences with precise timing, main movements, and camera tracking for each video phase.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-blue-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">4. Scene</h3>
                          <p className="text-sm text-slate-600">
                            Shooting location, time of day, environment, weather conditions, and overall atmosphere.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">5. Cinematography</h3>
                          <p className="text-sm text-slate-600">
                            Lighting (source, quality, temperature, key/fill ratio), depth of field, and lighting evolution.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-yellow-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">6. Audio</h3>
                          <p className="text-sm text-slate-600">
                            Music style, sound effects, ambient sounds, and audio dynamics for the video.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-red-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">7. Post-Production</h3>
                          <p className="text-sm text-slate-600">
                            Color grading, visual effects, transitions, and final editing touches.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-orange-600 pl-4">
                          <h3 className="font-semibold text-slate-900 mb-2">8. Tone & Atmosphere</h3>
                          <p className="text-sm text-slate-600">
                            Overall mood, emotional arc, visual style, and atmosphere of the video.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sora 2 Tab */}
                <TabsContent value="sora" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Code className="h-6 w-6 text-indigo-600" />
                        <CardTitle>Using with Sora 2</CardTitle>
                      </div>
                      <CardDescription>
                        OpenAI's Sora 2 API integration for video generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{soraExample}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(soraExample, "sora")}
                        >
                          {copiedCode === "sora" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Veo 3 Tab */}
                <TabsContent value="veo" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Code className="h-6 w-6 text-purple-600" />
                        <CardTitle>Using with Veo 3</CardTitle>
                      </div>
                      <CardDescription>
                        Google's Veo 3 API integration for video generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{veoExample}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(veoExample, "veo")}
                        >
                          {copiedCode === "veo" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Runway Tab */}
                <TabsContent value="runway" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Code className="h-6 w-6 text-pink-600" />
                        <CardTitle>Using with Runway Gen-3</CardTitle>
                      </div>
                      <CardDescription>
                        Runway's Gen-3 API integration for video generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{runwayExample}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(runwayExample, "runway")}
                        >
                          {copiedCode === "runway" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Customization Tab */}
                <TabsContent value="custom" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Zap className="h-6 w-6 text-blue-600" />
                        <CardTitle>Customizing Prompts</CardTitle>
                      </div>
                      <CardDescription>
                        How to modify and personalize JSON prompts for your specific needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{customizationExample}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(customizationExample, "custom")}
                        >
                          {copiedCode === "custom" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* LLM API Tab */}
          <TabsContent value="llm-api">
            <div className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-2">LLM API Integration</h2>
                <p className="text-lg text-slate-600">
                  Use AI to generate and customize video prompts programmatically
                </p>
              </div>

              <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>
                    LLM API integration for automated prompt generation and customization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    We're working on integrating LLM APIs to help you generate and customize video prompts automatically. 
                    Stay tuned for updates!
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tone Guide Tab */}
          <TabsContent value="tone-guide">
            <ToneGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
