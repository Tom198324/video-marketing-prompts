import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Code, BookOpen, Zap, Copy, Check } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Documentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
            <Link href="/gallery">
              <Button variant="ghost">Gallery</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Documentation</h2>
          <p className="text-lg text-slate-600">
            Complete guides for using JSON prompts with Sora 2, Veo 3, and Runway Gen-3
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="sora">Sora 2</TabsTrigger>
            <TabsTrigger value="veo">Veo 3</TabsTrigger>
            <TabsTrigger value="runway">Runway</TabsTrigger>
            <TabsTrigger value="custom">Customization</TabsTrigger>
            <TabsTrigger value="api">LLM API</TabsTrigger>
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
                      Ambient sounds, foley effects, background music, and audio-visual synchronization.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-semibold text-slate-900 mb-2">7. Visual Rules</h3>
                    <p className="text-sm text-slate-600">
                      Realism rules, visual continuity, temporal coherence, and technical restrictions.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-600 pl-4">
                    <h3 className="font-semibold text-slate-900 mb-2">8. Technical Specifications</h3>
                    <p className="text-sm text-slate-600">
                      Resolution, color space, bit depth, output quality, and video duration.
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-indigo-600" />
                    <div>
                      <CardTitle>Integration with OpenAI Sora 2</CardTitle>
                      <CardDescription>Code example to generate videos with the Sora 2 API</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(soraExample, 'sora')}
                  >
                    {copiedCode === 'sora' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedCode === 'sora' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{soraExample}</code>
                </pre>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-slate-900">Required Setup</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                    <li>Node.js 18+ or Python 3.8+</li>
                    <li>OpenAI API key with access to Sora 2</li>
                    <li>Installed <code className="bg-slate-100 px-2 py-1 rounded">openai</code> package</li>
                  </ul>
                  
                  <h3 className="font-semibold text-slate-900 mt-4">Installation</h3>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                    npm install openai
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Veo 3 Tab */}
          <TabsContent value="veo" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-purple-600" />
                    <div>
                      <CardTitle>Integration with Google Veo 3</CardTitle>
                      <CardDescription>Code example to generate videos with the Veo 3 API</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(veoExample, 'veo')}
                  >
                    {copiedCode === 'veo' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedCode === 'veo' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{veoExample}</code>
                </pre>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-slate-900">Required Setup</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                    <li>Node.js 18+ or Python 3.9+</li>
                    <li>Google Cloud API key with access to Veo 3</li>
                    <li>Installed <code className="bg-slate-100 px-2 py-1 rounded">@google/generative-ai</code> package</li>
                  </ul>
                  
                  <h3 className="font-semibold text-slate-900 mt-4">Installation</h3>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                    npm install @google/generative-ai
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Runway Tab */}
          <TabsContent value="runway" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-pink-600" />
                    <div>
                      <CardTitle>Integration with Runway Gen-3</CardTitle>
                      <CardDescription>Code example to generate videos with the Runway Gen-3 API</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(runwayExample, 'runway')}
                  >
                    {copiedCode === 'runway' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedCode === 'runway' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{runwayExample}</code>
                </pre>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-slate-900">Required Setup</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                    <li>Node.js 18+ or Python 3.8+</li>
                    <li>Runway API key with access to Gen-3</li>
                    <li>Package <code className="bg-slate-100 px-2 py-1 rounded">node-fetch</code> or <code className="bg-slate-100 px-2 py-1 rounded">axios</code></li>
                  </ul>
                  
                  <h3 className="font-semibold text-slate-900 mt-4">Installation</h3>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm">
                    npm install node-fetch
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customization Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle>Customize Prompts</CardTitle>
                      <CardDescription>Guide to adapt prompts to your specific needs</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(customizationExample, 'custom')}
                  >
                    {copiedCode === 'custom' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedCode === 'custom' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
                  <code>{customizationExample}</code>
                </pre>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Customizable Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">Subject Identity</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Age and gender</li>
                          <li>• Physical appearance</li>
                          <li>• Clothing</li>
                          <li>• Emotional expression</li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">Environment</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Shooting location</li>
                          <li>• Time of day</li>
                          <li>• Weather conditions</li>
                          <li>• Set and props</li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">Technical</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Camera and lens</li>
                          <li>• Camera movement</li>
                          <li>• Lighting</li>
                          <li>• Composition</li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">Audio</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Sound ambiance</li>
                          <li>• Foley effects</li>
                          <li>• Background music</li>
                          <li>• Voiceover (optional)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                    <p className="text-sm text-blue-800">
                      Always keep the 8-section structure when customizing. Modify only property values, not the JSON structure itself, to ensure compatibility with all platforms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API LLM Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-indigo-600" />
                  <CardTitle>Integrated LLM API</CardTitle>
                </div>
                <CardDescription>
                  Use artificial intelligence to automatically generate prompt variations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-slate max-w-none">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">🎯 What is the LLM API for?</h3>
                  <p className="text-slate-700 mb-4">
                    The integrated LLM (Large Language Model) API allows using <strong>AI models</strong> to generate intelligent text content. In this project, it is used to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                    <li><strong>Generate prompt variations</strong> by intelligently modifying certain parameters (character, location, style, etc.)</li>
                    <li><strong>Understand the JSON structure</strong> of prompts and produce coherent variations</li>
                    <li><strong>Create creative content</strong> while respecting technical constraints (strict JSON format, mandatory sections)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-slate-900 mb-4">⚙️ How does it work?</h3>
                  <p className="text-slate-700 mb-4">
                    The API is accessible via the <code className="bg-slate-100 px-2 py-1 rounded text-sm">invokeLLM()</code> function located in <code className="bg-slate-100 px-2 py-1 rounded text-sm">server/_core/llm.ts</code>.
                  </p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">TypeScript</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`import { invokeLLM } from "./server/_core/llm";

const response = await invokeLLM({
  messages: [
    { role: "system", content: "You are a specialized assistant..." },
    { role: "user", content: "Generate a variation of this prompt..." }
  ],
  response_format: {
    type: "json_schema",
    json_schema: { /* Strict JSON schema */ }
  }
});`, "llm-basic")}
                      >
                        {copiedCode === "llm-basic" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`import { invokeLLM } from "./server/_core/llm";

const response = await invokeLLM({
  messages: [
    { role: "system", content: "You are a specialized assistant..." },
    { role: "user", content: "Generate a variation of this prompt..." }
  ],
  response_format: {
    type: "json_schema",
    json_schema: { /* Strict JSON schema */ }
  }
});`}</code>
                    </pre>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Workflow</h4>
                    <ol className="list-decimal pl-6 space-y-2 text-blue-800">
                      <li><strong>Send the request</strong>: You send messages (system instructions + user query)</li>
                      <li><strong>AI processing</strong>: The LLM model analyzes the context and generates a response</li>
                      <li><strong>Format validation</strong>: If using json_schema, the AI ensures valid JSON</li>
                      <li><strong>Response return</strong>: You receive the generated content in response.choices[0].message.content</li>
                    </ol>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-4">🔌 Usage via third-party application</h3>
                  <p className="text-slate-700 mb-4">
                    You can integrate the LLM API into your external applications in two ways:
                  </p>

                  <h4 className="font-semibold text-slate-900 mb-3">1. Via custom tRPC endpoints (recommended)</h4>
                  <p className="text-slate-700 mb-3">
                    Create tRPC endpoints that expose LLM functionalities:
                  </p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">TypeScript - server/routers.ts</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`myCustomGenerator: publicProcedure
  .input(z.object({ prompt: z.string() }))
  .mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        { role: "user", content: input.prompt }
      ]
    });
    return { result: response.choices[0].message.content };
  })`, "llm-endpoint")}
                      >
                        {copiedCode === "llm-endpoint" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`myCustomGenerator: publicProcedure
  .input(z.object({ prompt: z.string() }))
  .mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        { role: "user", content: input.prompt }
      ]
    });
    return { result: response.choices[0].message.content };
  })`}</code>
                    </pre>
                  </div>

                  <p className="text-slate-700 mb-3">
                    Then call this endpoint from any external application via HTTP:
                  </p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">cURL</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`curl -X POST https://your-site.manus.space/api/trpc/myCustomGenerator \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Generate a description..."}'`, "llm-curl")}
                      >
                        {copiedCode === "llm-curl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`curl -X POST https://your-site.manus.space/api/trpc/myCustomGenerator \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Generate a description..."}'`}</code>
                    </pre>
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-3">2. Python Integration</h4>
                  <p className="text-slate-700 mb-3">
                    Example integration from a Python application:
                  </p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">Python</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`import requests

response = requests.post(
    "https://your-site.manus.space/api/trpc/generator.generateVariation",
    json={
        "promptId": 1,
        "variations": {"subject": True, "location": True},
        "count": 3
    }
)

variations = response.json()["result"]["data"]["variations"]
print(f"Generated {len(variations)} variations!")`, "llm-python")}
                      >
                        {copiedCode === "llm-python" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`import requests

response = requests.post(
    "https://your-site.manus.space/api/trpc/generator.generateVariation",
    json={
        "promptId": 1,
        "variations": {"subject": True, "location": True},
        "count": 3
    }
)

variations = response.json()["result"]["data"]["variations"]
print(f"Generated {len(variations)} variations!")`}</code>
                    </pre>
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-3">3. JavaScript/Node.js Integration</h4>
                  <p className="text-slate-700 mb-3">
                    Example using fetch (browser) or axios (Node.js):
                  </p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">JavaScript</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`// Using fetch (browser or Node.js 18+)
fetch('https://your-site.manus.space/api/trpc/generator.generateVariation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    promptId: 1,
    variations: { subject: true, location: true },
    count: 3
  })
})
.then(res => res.json())
.then(data => {
  const variations = data.result.data.variations;
  console.log(\`Generated \${variations.length} variations!\`);
});

// Using axios (Node.js)
const axios = require('axios');

const response = await axios.post(
  'https://your-site.manus.space/api/trpc/generator.generateVariation',
  {
    promptId: 1,
    variations: { subject: true, location: true },
    count: 3
  }
);

const variations = response.data.result.data.variations;
console.log(\`Generated \${variations.length} variations!\`);`, "llm-javascript")}
                      >
                        {copiedCode === "llm-javascript" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`// Using fetch (browser or Node.js 18+)
fetch('https://your-site.manus.space/api/trpc/generator.generateVariation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    promptId: 1,
    variations: { subject: true, location: true },
    count: 3
  })
})
.then(res => res.json())
.then(data => {
  const variations = data.result.data.variations;
  console.log(\`Generated \${variations.length} variations!\`);
});

// Using axios (Node.js)
const axios = require('axios');

const response = await axios.post(
  'https://your-site.manus.space/api/trpc/generator.generateVariation',
  {
    promptId: 1,
    variations: { subject: true, location: true },
    count: 3
  }
);

const variations = response.data.result.data.variations;
console.log(\`Generated \${variations.length} variations!\`);`}</code>
                    </pre>
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-3">4. Go Integration</h4>
                  <p className="text-slate-700 mb-3">
                    Example using the standard net/http package:
                  </p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">Go</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type Request struct {
    PromptID   int                    \`json:"promptId"\`
    Variations map[string]bool        \`json:"variations"\`
    Count      int                    \`json:"count"\`
}

type Response struct {
    Result struct {
        Data struct {
            Variations []map[string]interface{} \`json:"variations"\`
        } \`json:"data"\`
    } \`json:"result"\`
}

func main() {
    reqData := Request{
        PromptID: 1,
        Variations: map[string]bool{
            "subject":  true,
            "location": true,
        },
        Count: 3,
    }

    jsonData, _ := json.Marshal(reqData)
    
    resp, err := http.Post(
        "https://your-site.manus.space/api/trpc/generator.generateVariation",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    
    var result Response
    json.Unmarshal(body, &result)
    
    fmt.Printf("Generated %d variations!\\n", len(result.Result.Data.Variations))
}`, "llm-go")}
                      >
                        {copiedCode === "llm-go" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type Request struct {
    PromptID   int                    \`json:"promptId"\`
    Variations map[string]bool        \`json:"variations"\`
    Count      int                    \`json:"count"\`
}

type Response struct {
    Result struct {
        Data struct {
            Variations []map[string]interface{} \`json:"variations"\`
        } \`json:"data"\`
    } \`json:"result"\`
}

func main() {
    reqData := Request{
        PromptID: 1,
        Variations: map[string]bool{
            "subject":  true,
            "location": true,
        },
        Count: 3,
    }

    jsonData, _ := json.Marshal(reqData)
    
    resp, err := http.Post(
        "https://your-site.manus.space/api/trpc/generator.generateVariation",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    
    var result Response
    json.Unmarshal(body, &result)
    
    fmt.Printf("Generated %d variations!\\n", len(result.Result.Data.Variations))
}`}</code>
                    </pre>
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-3">5. PHP Integration</h4>
                  <p className="text-slate-700 mb-3">
                    Example using cURL:
                  </p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">PHP</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`<?php

$url = 'https://your-site.manus.space/api/trpc/generator.generateVariation';

$data = [
    'promptId' => 1,
    'variations' => [
        'subject' => true,
        'location' => true
    ],
    'count' => 3
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$variations = $result['result']['data']['variations'];

echo "Generated " . count($variations) . " variations!\\n";

?>`, "llm-php")}
                      >
                        {copiedCode === "llm-php" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`<?php

$url = 'https://your-site.manus.space/api/trpc/generator.generateVariation';

$data = [
    'promptId' => 1,
    'variations' => [
        'subject' => true,
        'location' => true
    ],
    'count' => 3
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$variations = $result['result']['data']['variations'];

echo "Generated " . count($variations) . " variations!\\n";

?>`}</code>
                    </pre>
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-3">6. Ruby Integration</h4>
                  <p className="text-slate-700 mb-3">
                    Example using Net::HTTP:
                  </p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-mono">Ruby</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => handleCopy(`require 'net/http'
require 'json'
require 'uri'

uri = URI('https://your-site.manus.space/api/trpc/generator.generateVariation')

data = {
  promptId: 1,
  variations: {
    subject: true,
    location: true
  },
  count: 3
}

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri.path, {'Content-Type' => 'application/json'})
request.body = data.to_json

response = http.request(request)
result = JSON.parse(response.body)

variations = result['result']['data']['variations']
puts "Generated #{variations.length} variations!"`, "llm-ruby")}
                      >
                        {copiedCode === "llm-ruby" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-300 overflow-x-auto">
                      <code>{`require 'net/http'
require 'json'
require 'uri'

uri = URI('https://your-site.manus.space/api/trpc/generator.generateVariation')

data = {
  promptId: 1,
  variations: {
    subject: true,
    location: true
  },
  count: 3
}

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri.path, {'Content-Type' => 'application/json'})
request.body = data.to_json

response = http.request(request)
result = JSON.parse(response.body)

variations = result['result']['data']['variations']
puts "Generated #{variations.length} variations!"`}</code>
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-4">🔒 Security and Best Practices</h3>
                  <div className="bg-red-50 border-l-4 border-red-600 p-4">
                    <ul className="list-disc pl-6 space-y-2 text-red-800">
                      <li><strong>Never expose API keys</strong> on the client side (frontend)</li>
                      <li><strong>Always route through the backend</strong> (tRPC) for LLM calls</li>
                      <li><strong>Limit requests</strong> if you expose publicly (rate limiting)</li>
                      <li><strong>Validate inputs</strong> to prevent malicious prompt injections</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 mt-6">
                    <h4 className="font-semibold text-green-900 mb-2">💡 Use Cases for Third-Party Apps</h4>
                    <ul className="list-disc pl-6 space-y-2 text-green-800">
                      <li><strong>Mobile integration</strong>: Build iOS/Android apps that call your tRPC endpoints</li>
                      <li><strong>Automation</strong>: Python/Node.js scripts that generate prompts in bulk</li>
                      <li><strong>Webhooks</strong>: Trigger generation from other services (Zapier, Make, etc.)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Which platform should I choose?</h3>
              <p className="text-sm text-slate-600">
                <strong>Sora 2</strong> excels at realism and complex camera movements. 
                <strong> Veo 3</strong> offers excellent temporal coherence and detailed characters. 
                <strong> Runway Gen-3</strong> is ideal for rapid iteration and creative modifications.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I change the video duration?</h3>
              <p className="text-sm text-slate-600">
                Yes! All our prompts are set for 20 seconds, but you can adjust the <code className="bg-slate-100 px-2 py-1 rounded">duration</code> parameter in the technical specifications as needed.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Do the prompts work in multiple languages?</h3>
              <p className="text-sm text-slate-600">
                Prompts are in English for maximum compatibility across all platforms. You can translate textual descriptions but keep technical terms (camera names, lenses) in English.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How much does video generation cost?</h3>
              <p className="text-sm text-slate-600">
                Costs vary by platform: Sora 2 (~$0.20-0.50/video), Veo 3 (~$0.15-0.40/video), Runway Gen-3 (~$0.10-0.30/video). Check current pricing on each platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I use the videos commercially?</h3>
              <p className="text-sm text-slate-600">
                Yes, the prompts are free to use. However, verify the commercial usage terms of the generation platform you use (Sora 2, Veo 3, or Runway Gen-3).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardHeader className="text-center space-y-4 py-8">
            <CardTitle className="text-3xl">Ready to Create?</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Explore our collection of 50 prompts and start generating professional videos
            </CardDescription>
            <div className="pt-4">
              <Link href="/prompts">
                <Button size="lg" variant="secondary">
                  Explore Prompts
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}