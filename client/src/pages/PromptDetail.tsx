import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Copy, Download, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

export default function PromptDetail() {
  const { promptNumber } = useParams<{ promptNumber: string }>();
  const [copied, setCopied] = useState(false);
  
  const { data: prompt, isLoading } = trpc.prompts.getByNumber.useQuery({
    promptNumber: parseInt(promptNumber || "1"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-600 mb-4">Prompt not found</p>
            <Link href="/prompts">
              <Button>Back to prompts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const promptData = JSON.parse(prompt.promptJson);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptJson);
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(prompt.promptJson);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `prompt_${prompt.promptNumber}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Prompt downloaded");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/prompts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to prompts
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded">
              Prompt #{prompt.promptNumber}
            </span>
            <span className="text-sm text-slate-600">
              Duration: {prompt.durationSeconds}s (original: {prompt.originalDuration}s)
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{prompt.title}</h1>
          <p className="text-lg text-slate-600 mb-6">{prompt.description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Sector:</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                {prompt.industrySector}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Style:</span>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">
                {prompt.visualStyle}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Scenario:</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {prompt.scenarioType}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy JSON"}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Link href={`/generator?promptId=${prompt.id}`}>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate a variation
              </Button>
            </Link>
          </div>
        </div>

        {/* Prompt Details */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="json">Full JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shot & Composition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Camera:</span>
                    <p className="text-slate-600">{promptData.shot.camera_system}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Lens:</span>
                    <p className="text-slate-600">{promptData.shot.primary_lens}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Composition:</span>
                    <p className="text-slate-600">{promptData.shot.composition}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Movement:</span>
                    <p className="text-slate-600 text-sm">{promptData.shot.camera_motion}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Identity:</span>
                    <p className="text-slate-600">{promptData.subject.identity.age}, {promptData.subject.identity.gender}</p>
                  </div>
                  {promptData.subject.physical && (
                    <div>
                      <span className="font-medium text-slate-700">Physical:</span>
                      <p className="text-slate-600 text-sm">{promptData.subject.physical.height}, {promptData.subject.physical.posture}</p>
                    </div>
                  )}
                  {promptData.subject.facial_features && (
                    <div>
                      <span className="font-medium text-slate-700">Facial features:</span>
                      <p className="text-slate-600 text-sm">{promptData.subject.facial_features.expression}</p>
                    </div>
                  )}
                  {promptData.subject.wardrobe && (
                    <div>
                      <span className="font-medium text-slate-700">Outfit:</span>
                      <p className="text-slate-600 text-sm">{promptData.subject.wardrobe.top || promptData.subject.wardrobe.outfit}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scene & Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Location:</span>
                    <p className="text-slate-600">{promptData.scene.location}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Time:</span>
                    <p className="text-slate-600">{promptData.scene.time_of_day}</p>
                  </div>
                  {promptData.scene.environment && (
                    <div>
                      <span className="font-medium text-slate-700">Environment:</span>
                      <p className="text-slate-600 text-sm">
                        {typeof promptData.scene.environment === 'string' 
                          ? promptData.scene.environment 
                          : promptData.scene.environment.background}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action & Sequences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {promptData.action.sequences && promptData.action.sequences.map((seq: any, idx: number) => (
                    <div key={idx}>
                      <span className="font-medium text-slate-700">Sequence {idx + 1} ({seq.timing}):</span>
                      <p className="text-slate-600 text-sm">{seq.primary_motion}</p>
                    </div>
                  ))}
                  {promptData.action.total_duration && (
                    <div>
                      <span className="font-medium text-slate-700">Total duration:</span>
                      <p className="text-slate-600 text-sm">{promptData.action.total_duration}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {promptData.audio.ambient && (
                    <div>
                      <span className="font-medium text-slate-700">Ambient:</span>
                      <p className="text-slate-600 text-sm">{promptData.audio.ambient}</p>
                    </div>
                  )}
                  {promptData.audio.foley && (
                    <div>
                      <span className="font-medium text-slate-700">Foley:</span>
                      <p className="text-slate-600 text-sm">{promptData.audio.foley}</p>
                    </div>
                  )}
                  {promptData.audio.music && (
                    <div>
                      <span className="font-medium text-slate-700">Music:</span>
                      <p className="text-slate-600 text-sm">{promptData.audio.music}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cinematography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Light source:</span>
                    <p className="text-slate-600">{promptData.cinematography.lighting.primary_source}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Quality:</span>
                    <p className="text-slate-600">{promptData.cinematography.lighting.quality}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Temperature:</span>
                    <p className="text-slate-600">{promptData.cinematography.lighting.color_temperature}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Key/Fill ratio:</span>
                    <p className="text-slate-600">{promptData.cinematography.lighting.key_to_fill_ratio}</p>
                  </div>
                  {promptData.cinematography.lighting.evolution && (
                    <div>
                      <span className="font-medium text-slate-700">Evolution:</span>
                      <p className="text-slate-600 text-sm">{promptData.cinematography.lighting.evolution}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Resolution:</span>
                    <p className="text-slate-600">{promptData.technical_specifications.resolution}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Color space:</span>
                    <p className="text-slate-600">{promptData.technical_specifications.color_space}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Bit depth:</span>
                    <p className="text-slate-600">{promptData.technical_specifications.bit_depth}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Output quality:</span>
                    <p className="text-slate-600">{promptData.technical_specifications.output_quality}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Duration:</span>
                    <p className="text-slate-600">{promptData.technical_specifications.duration}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Visual Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Realism:</span>
                    <p className="text-slate-600 text-sm">{promptData.visual_rules.realism}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Continuity:</span>
                    <p className="text-slate-600 text-sm">{promptData.visual_rules.continuity}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Restrictions:</span>
                    <p className="text-slate-600 text-sm">{promptData.visual_rules.restrictions}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sequences" className="space-y-6">
            <div className="space-y-6">
              {promptData.action.sequences && promptData.action.sequences.map((seq: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>Sequence {idx + 1}</CardTitle>
                    <CardDescription>{seq.timing}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium text-slate-700">Primary movement:</span>
                      <p className="text-slate-600">{seq.primary_motion}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Camera:</span>
                      <p className="text-slate-600">{seq.camera_follows}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="json">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Full JSON</CardTitle>
                    <CardDescription>Prompt JSON ready to use with Sora 2, Veo 3, or Runway Gen-3</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{JSON.stringify(promptData, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}