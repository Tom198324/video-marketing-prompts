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

  const CodeBlock = ({ code, id, language = "javascript" }: { code: string; id: string; language?: string }) => (
    <div className="relative">
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 text-slate-400 hover:text-white"
        onClick={() => handleCopy(code, id)}
      >
        {copiedCode === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );

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

        {/* Authentication Tab */}
        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle>Authentication & Setup</CardTitle>
              </div>
              <CardDescription>Configure API keys and environment variables securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">API Key Setup</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">1. Obtain API Keys</h4>
                    <ul className="space-y-2 text-sm text-slate-600 ml-4">
                      <li>• <strong>OpenAI Sora:</strong> Visit <a href="https://platform.openai.com" className="text-indigo-600 hover:underline">platform.openai.com</a> → API Keys</li>
                      <li>• <strong>Google Veo:</strong> Visit <a href="https://console.cloud.google.com" className="text-indigo-600 hover:underline">console.cloud.google.com</a> → APIs & Services → Credentials</li>
                      <li>• <strong>Runway:</strong> Visit <a href="https://runwayml.com/api" className="text-indigo-600 hover:underline">runwayml.com/api</a> → Settings → API Keys</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">2. Environment Variables</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Store API keys securely in environment variables. Never commit keys to version control.
                    </p>
                    <CodeBlock
                      id="env-setup"
                      language="bash"
                      code={`# .env file
OPENAI_API_KEY=sk-proj-...your-key-here...
GOOGLE_CLOUD_API_KEY=AIza...your-key-here...
RUNWAY_API_KEY=rw_...your-key-here...

# Optional: Set default platform
DEFAULT_VIDEO_PLATFORM=sora`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">3. Load Environment Variables</h4>
                    <CodeBlock
                      id="env-load"
                      code={`// Node.js with dotenv
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not found in environment');
}`}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Security Best Practices</AlertTitle>
                <AlertDescription>
                  <ul className="space-y-1 mt-2 text-sm">
                    <li>• Never expose API keys in client-side code</li>
                    <li>• Use server-side proxies for API calls</li>
                    <li>• Rotate keys regularly (every 90 days)</li>
                    <li>• Set up rate limiting and usage alerts</li>
                    <li>• Use separate keys for dev/staging/production</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Start Tab */}
        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Rocket className="h-6 w-6 text-indigo-600" />
                <CardTitle>Quick Start Examples</CardTitle>
              </div>
              <CardDescription>Get started with basic video generation in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">OpenAI Sora 2</h3>
                <CodeBlock
                  id="sora-example"
                  code={`import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load your JSON prompt
const prompt = {
  "shot": {
    "camera_system": "RED V-RAPTOR 8K VV",
    "lens": "Canon CN-E 24mm T1.5 L F",
    "composition": "Medium close-up, rule of thirds"
  },
  "subject": {
    "identity": "Artisan barista, early 30s",
    "appearance": "Navy apron, focused expression"
  },
  "scene": {
    "location": "Modern specialty coffee shop",
    "time_of_day": "Morning golden hour"
  }
  // ... rest of your prompt
};

// Generate video
const response = await client.videos.generate({
  model: "sora-2",
  prompt: JSON.stringify(prompt),
  size: "1920x1080",
  duration: 20
});

console.log('Video URL:', response.data[0].url);`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Google Veo 3</h3>
                <CodeBlock
                  id="veo-example"
                  code={`import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY);

// Load your JSON prompt
const prompt = require('./prompts/coffee-shop.json');

// Generate video
const model = genAI.getGenerativeModel({ model: 'veo-3' });
const result = await model.generateVideo({
  prompt: JSON.stringify(prompt),
  resolution: '4k',
  duration: 30,
  aspectRatio: '16:9'
});

const videoUrl = await result.video.getUrl();
console.log('Video URL:', videoUrl);`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Runway Gen-3</h3>
                <CodeBlock
                  id="runway-example"
                  code={`import Runway from '@runwayml/sdk';

const runway = new Runway({
  apiKey: process.env.RUNWAY_API_KEY,
});

// Load your JSON prompt
const prompt = require('./prompts/product-demo.json');

// Generate video
const task = await runway.videos.create({
  model: 'gen3',
  prompt: JSON.stringify(prompt),
  duration: 15,
  resolution: '1920x1080'
});

// Poll for completion
const video = await runway.tasks.wait(task.id);
console.log('Video URL:', video.output.url);`}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Pro Tip</AlertTitle>
                <AlertDescription>
                  All platforms accept stringified JSON. For best results, include all 8 sections of our prompt structure:
                  shot, subject, action, scene, cinematography, audio, visual_rules, and technical_specifications.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Usage Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-yellow-600" />
                <CardTitle>Advanced Usage</CardTitle>
              </div>
              <CardDescription>Structured outputs, streaming, error handling, and retry logic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Streaming Progress Updates</h3>
                <CodeBlock
                  id="streaming"
                  code={`// OpenAI Sora with streaming
const stream = await client.videos.generate({
  model: "sora-2",
  prompt: JSON.stringify(prompt),
  stream: true
});

for await (const chunk of stream) {
  if (chunk.progress) {
    console.log(\`Progress: \${chunk.progress}%\`);
  }
  if (chunk.status === 'completed') {
    console.log('Video URL:', chunk.url);
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Error Handling & Retries</h3>
                <CodeBlock
                  id="error-handling"
                  code={`async function generateVideoWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.videos.generate({
        model: "sora-2",
        prompt: JSON.stringify(prompt)
      });
      return response;
    } catch (error) {
      console.error(\`Attempt \${attempt} failed:\`, error.message);
      
      // Handle specific errors
      if (error.code === 'rate_limit_exceeded') {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(\`Rate limited. Waiting \${waitTime}ms...\`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (error.code === 'invalid_prompt') {
        throw new Error('Prompt validation failed. Check your JSON structure.');
      } else if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Batch Processing</h3>
                <CodeBlock
                  id="batch"
                  code={`// Generate multiple variations in parallel
const prompts = [
  require('./prompts/variation-1.json'),
  require('./prompts/variation-2.json'),
  require('./prompts/variation-3.json')
];

const results = await Promise.allSettled(
  prompts.map(prompt => 
    client.videos.generate({
      model: "sora-2",
      prompt: JSON.stringify(prompt)
    })
  )
);

const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);

console.log(\`Generated \${successful.length}/\${prompts.length} videos\`);`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Webhook Notifications</h3>
                <CodeBlock
                  id="webhooks"
                  code={`// Set up webhook for async generation
const task = await client.videos.generate({
  model: "sora-2",
  prompt: JSON.stringify(prompt),
  webhook_url: "https://your-app.com/api/video-complete",
  webhook_secret: process.env.WEBHOOK_SECRET
});

// Verify webhook signature (Express.js)
app.post('/api/video-complete', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  const { video_url, task_id, status } = req.body;
  console.log(\`Video \${task_id} completed: \${video_url}\`);
  res.status(200).send('OK');
});`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600" />
                <CardTitle>Best Practices</CardTitle>
              </div>
              <CardDescription>Optimization tips, prompt engineering, and common pitfalls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Prompt Engineering Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Be Specific with Camera Details</h4>
                      <p className="text-sm text-slate-600">
                        Use real camera models (RED V-RAPTOR, ARRI ALEXA) and specific lenses (Canon CN-E 24mm T1.5) 
                        instead of generic terms like "professional camera"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Include Precise Timing</h4>
                      <p className="text-sm text-slate-600">
                        Specify exact durations for each action (0-3s, 3-8s, 8-12s) to ensure smooth narrative flow 
                        and avoid abrupt transitions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Define Emotional Arc</h4>
                      <p className="text-sm text-slate-600">
                        Map emotional progression (Curiosity → Anticipation → Satisfaction) to create engaging, 
                        story-driven videos that resonate with viewers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Use Tone & Atmosphere</h4>
                      <p className="text-sm text-slate-600">
                        Select primary and secondary tones from our 120+ options (Sophisticated, Energetic, Cinematic) 
                        to establish consistent visual style
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Performance Optimization</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">1. Cache Frequently Used Prompts</h4>
                    <CodeBlock
                      id="caching"
                      code={`// Cache prompt templates in memory
const promptCache = new Map();

function getCachedPrompt(templateId) {
  if (!promptCache.has(templateId)) {
    const prompt = require(\`./prompts/\${templateId}.json\`);
    promptCache.set(templateId, prompt);
  }
  return promptCache.get(templateId);
}`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">2. Implement Rate Limiting</h4>
                    <CodeBlock
                      id="rate-limit"
                      code={`import Bottleneck from 'bottleneck';

// Limit to 10 requests per minute
const limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 6000 // 6 seconds between requests
});

const generateVideo = limiter.wrap(async (prompt) => {
  return await client.videos.generate({
    model: "sora-2",
    prompt: JSON.stringify(prompt)
  });
});`}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">3. Monitor Usage & Costs</h4>
                    <CodeBlock
                      id="monitoring"
                      code={`// Track API usage
let totalCost = 0;
const costPerVideo = {
  'sora-2': 0.50,
  'veo-3': 0.30,
  'gen3': 0.20
};

async function generateWithTracking(model, prompt) {
  const start = Date.now();
  const result = await client.videos.generate({ model, prompt });
  const duration = Date.now() - start;
  
  totalCost += costPerVideo[model];
  console.log(\`Generated in \${duration}ms. Total cost: $\${totalCost.toFixed(2)}\`);
  
  return result;
}`}
                    />
                  </div>
                </div>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900">Common Pitfalls to Avoid</AlertTitle>
                <AlertDescription className="text-amber-800">
                  <ul className="space-y-1 mt-2 text-sm">
                    <li>• <strong>Generic descriptions:</strong> "Beautiful scene" → Use specific details "Golden hour sunlight streaming through floor-to-ceiling windows"</li>
                    <li>• <strong>Missing timing:</strong> Always specify duration for each action sequence</li>
                    <li>• <strong>Inconsistent style:</strong> Ensure cinematography matches your chosen tone (e.g., don't mix Minimalist with heavy color grading)</li>
                    <li>• <strong>Ignoring audio:</strong> Include foley and music cues for professional results</li>
                    <li>• <strong>Skipping validation:</strong> Use our Validator tool before generating to catch issues early</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api-ref" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileCode className="h-6 w-6 text-purple-600" />
                <CardTitle>API Reference</CardTitle>
              </div>
              <CardDescription>Complete parameter documentation and response formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">JSON Prompt Structure</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Our prompts follow an 8-section structure for maximum control and consistency:
                </p>
                <CodeBlock
                  id="prompt-structure"
                  language="json"
                  code={`{
  "shot": {
    "camera_system": "string",      // e.g., "RED V-RAPTOR 8K VV"
    "lens": "string",                // e.g., "Canon CN-E 24mm T1.5 L F"
    "composition": "string",         // e.g., "Medium close-up, rule of thirds"
    "camera_movement": "string"      // e.g., "Slow dolly-in, handheld stabilization"
  },
  "subject": {
    "identity": "string",            // Who/what is the main subject
    "appearance": "string",          // Visual details, clothing, expression
    "expression": "string"           // Emotional state, body language
  },
  "action": {
    "timing": "string",              // Total duration (e.g., "20 seconds")
    "main_movements": [              // Array of timed actions
      {
        "time": "string",            // e.g., "0-3s"
        "description": "string"      // What happens during this time
      }
    ],
    "camera_tracking": "string"      // How camera follows subject
  },
  "scene": {
    "location": "string",            // Where the scene takes place
    "time_of_day": "string",         // e.g., "Morning golden hour"
    "environment": "string",         // Surroundings, props, atmosphere
    "atmosphere": "string"           // Mood, feeling, ambiance
  },
  "cinematography": {
    "lighting": "string",            // Lighting setup and quality
    "color_temperature": "string",   // e.g., "Warm (3200K)"
    "depth_of_field": "string",      // e.g., "Shallow (f/1.5)"
    "color_grading": "string"        // Post-processing style
  },
  "audio": {
    "foley": "string",               // Sound effects
    "music": "string",               // Background music style
    "sync_points": "string"          // Audio-visual synchronization
  },
  "visual_rules": {
    "realism": "string",             // Level of photorealism
    "continuity": "string",          // Consistency requirements
    "coherence": "string"            // Narrative flow
  },
  "technical_specifications": {
    "resolution": "string",          // e.g., "1920x1080"
    "frame_rate": "string",          // e.g., "24 fps"
    "color_space": "string",         // e.g., "Rec. 709"
    "duration": "string"             // e.g., "20 seconds"
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">API Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-3 font-semibold">Parameter</th>
                        <th className="text-left p-3 font-semibold">Type</th>
                        <th className="text-left p-3 font-semibold">Required</th>
                        <th className="text-left p-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-mono text-xs">prompt</td>
                        <td className="p-3">string</td>
                        <td className="p-3"><Badge variant="destructive">Yes</Badge></td>
                        <td className="p-3">Stringified JSON prompt object</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">model</td>
                        <td className="p-3">string</td>
                        <td className="p-3"><Badge variant="destructive">Yes</Badge></td>
                        <td className="p-3">sora-2, veo-3, or gen3</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">resolution</td>
                        <td className="p-3">string</td>
                        <td className="p-3"><Badge>No</Badge></td>
                        <td className="p-3">1920x1080, 3840x2160 (4K), etc.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">duration</td>
                        <td className="p-3">number</td>
                        <td className="p-3"><Badge>No</Badge></td>
                        <td className="p-3">Video length in seconds (5-60)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">aspect_ratio</td>
                        <td className="p-3">string</td>
                        <td className="p-3"><Badge>No</Badge></td>
                        <td className="p-3">16:9, 9:16, 1:1, 4:5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">webhook_url</td>
                        <td className="p-3">string</td>
                        <td className="p-3"><Badge>No</Badge></td>
                        <td className="p-3">URL for async completion notification</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Response Format</h3>
                <CodeBlock
                  id="response-format"
                  language="json"
                  code={`{
  "id": "vid_abc123",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:32:45Z",
  "model": "sora-2",
  "output": {
    "url": "https://cdn.example.com/videos/vid_abc123.mp4",
    "duration": 20.5,
    "resolution": "1920x1080",
    "file_size": 45678912,
    "format": "mp4"
  },
  "usage": {
    "generation_time_seconds": 165,
    "cost_usd": 0.50
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Error Codes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-3 font-semibold">Code</th>
                        <th className="text-left p-3 font-semibold">Message</th>
                        <th className="text-left p-3 font-semibold">Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-mono text-xs">400</td>
                        <td className="p-3">Invalid prompt structure</td>
                        <td className="p-3">Validate JSON against schema</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">401</td>
                        <td className="p-3">Invalid API key</td>
                        <td className="p-3">Check environment variables</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">429</td>
                        <td className="p-3">Rate limit exceeded</td>
                        <td className="p-3">Implement exponential backoff</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">500</td>
                        <td className="p-3">Generation failed</td>
                        <td className="p-3">Retry with different parameters</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-xs">503</td>
                        <td className="p-3">Service temporarily unavailable</td>
                        <td className="p-3">Wait and retry after 60s</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Examples Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Terminal className="h-6 w-6 text-slate-600" />
                <CardTitle>Integration Examples</CardTitle>
              </div>
              <CardDescription>Platform-specific implementations with full working code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Node.js / TypeScript</h3>
                <CodeBlock
                  id="nodejs-full"
                  code={`import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateVideo(promptPath: string, outputDir: string) {
  try {
    // Load prompt from JSON file
    const promptData = await fs.readFile(promptPath, 'utf-8');
    const prompt = JSON.parse(promptData);
    
    console.log('Generating video with Sora 2...');
    
    // Generate video
    const response = await client.videos.generate({
      model: "sora-2",
      prompt: JSON.stringify(prompt),
      size: "1920x1080",
      duration: parseInt(prompt.technical_specifications.duration)
    });
    
    // Download video
    const videoUrl = response.data[0].url;
    const videoResponse = await fetch(videoUrl);
    const videoBuffer = await videoResponse.arrayBuffer();
    
    // Save to file
    const outputPath = path.join(outputDir, \`video_\${Date.now()}.mp4\`);
    await fs.writeFile(outputPath, Buffer.from(videoBuffer));
    
    console.log(\`✓ Video saved to \${outputPath}\`);
    return outputPath;
    
  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
}

// Usage
generateVideo('./prompts/coffee-shop.json', './output')
  .then(path => console.log('Success:', path))
  .catch(err => console.error('Error:', err));`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Python</h3>
                <CodeBlock
                  id="python-full"
                  language="python"
                  code={`import os
import json
import requests
from openai import OpenAI
from pathlib import Path

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_video(prompt_path: str, output_dir: str) -> str:
    """Generate video from JSON prompt using Sora 2"""
    
    # Load prompt
    with open(prompt_path, 'r') as f:
        prompt = json.load(f)
    
    print("Generating video with Sora 2...")
    
    # Generate video
    response = client.videos.generate(
        model="sora-2",
        prompt=json.dumps(prompt),
        size="1920x1080",
        duration=int(prompt['technical_specifications']['duration'].split()[0])
    )
    
    # Download video
    video_url = response.data[0].url
    video_data = requests.get(video_url).content
    
    # Save to file
    output_path = Path(output_dir) / f"video_{int(time.time())}.mp4"
    output_path.write_bytes(video_data)
    
    print(f"✓ Video saved to {output_path}")
    return str(output_path)

# Usage
if __name__ == "__main__":
    try:
        path = generate_video('./prompts/coffee-shop.json', './output')
        print(f"Success: {path}")
    except Exception as e:
        print(f"Error: {e}")`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">cURL</h3>
                <CodeBlock
                  id="curl-example"
                  language="bash"
                  code={`#!/bin/bash

# Load prompt from file
PROMPT=$(cat prompts/coffee-shop.json | jq -c .)

# Generate video with OpenAI Sora
curl https://api.openai.com/v1/videos/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d "{
    \\"model\\": \\"sora-2\\",
    \\"prompt\\": $PROMPT,
    \\"size\\": \\"1920x1080\\",
    \\"duration\\": 20
  }" \\
  | jq -r '.data[0].url' \\
  | xargs curl -o output/video.mp4

echo "✓ Video saved to output/video.mp4"`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Express.js API Endpoint</h3>
                <CodeBlock
                  id="express-api"
                  code={`import express from 'express';
import OpenAI from 'openai';
import multer from 'multer';

const app = express();
const upload = multer();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate-video', upload.none(), async (req, res) => {
  try {
    const { prompt, model = 'sora-2', resolution = '1920x1080' } = req.body;
    
    // Validate prompt
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Parse if string
    const promptObj = typeof prompt === 'string' ? JSON.parse(prompt) : prompt;
    
    // Generate video
    const response = await client.videos.generate({
      model,
      prompt: JSON.stringify(promptObj),
      size: resolution
    });
    
    res.json({
      success: true,
      video_url: response.data[0].url,
      task_id: response.id
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => console.log('API running on port 3000'));`}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Production Deployment Tips</AlertTitle>
                <AlertDescription>
                  <ul className="space-y-1 mt-2 text-sm">
                    <li>• Use environment-specific API keys (dev/staging/prod)</li>
                    <li>• Implement request queuing for high-volume scenarios</li>
                    <li>• Store generated videos in CDN (S3, Cloudflare R2)</li>
                    <li>• Log all API calls for debugging and cost tracking</li>
                    <li>• Set up monitoring alerts for failures and rate limits</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
