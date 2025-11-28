import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function Generator() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const promptIdFromUrl = urlParams.get('promptId');
  
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(
    promptIdFromUrl ? parseInt(promptIdFromUrl) : null
  );
  const [variationCount, setVariationCount] = useState<number>(1);
  const [activeVariationIndex, setActiveVariationIndex] = useState<number>(0);
  const [variations, setVariations] = useState({
    subject: false,
    location: false,
    style: false,
    equipment: false,
    lighting: false,
    action: false,
    audio: false,
    technical: false,
  });
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const { data: prompts, isLoading: promptsLoading } = trpc.prompts.list.useQuery();
  const generateMutation = trpc.generator.generateVariation.useMutation({
    onSuccess: (data) => {
      setGeneratedResult(data);
      toast.success("✅ Variation generated successfully - Your new prompt is ready!");
    },
    onError: (error) => {
      toast.error(`❌ Generation error: ${error.message}`);
    },
  });

  const handleGenerate = () => {
    if (!selectedPromptId) {
      toast.error("⚠️ No prompt selected - Please select a source prompt");
      return;
    }

    const hasVariations = Object.values(variations).some(v => v);
    if (!hasVariations) {
      toast.error("⚠️ No variation selected - Please select at least one parameter to modify");
      return;
    }

    generateMutation.mutate({
      promptId: selectedPromptId,
      count: variationCount,
      variations,
    });
  };

  const handleCopy = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    toast.success("✅ Copied to clipboard - The JSON prompt has been copied");
  };

  const handleDownload = (content: any, filename: string) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`✅ Download started - The file ${filename} has been downloaded`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Variation Generator
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Create automatic variations of your prompts</CardTitle>
              <CardDescription className="text-base">
                Select a source prompt and choose the parameters to modify. Our AI will automatically generate a coherent and professional variation.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Source prompt selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Select a source prompt</CardTitle>
                <CardDescription>Choose the prompt you want to modify</CardDescription>
              </CardHeader>
              <CardContent>
                {promptsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <Select
                    value={selectedPromptId?.toString() || ""}
                    onValueChange={(value) => setSelectedPromptId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a prompt..." />
                    </SelectTrigger>
                    <SelectContent>
                      {prompts?.map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.id.toString()}>
                          Prompt #{prompt.promptNumber} - {prompt.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Variation count selector */}
                <div className="mt-6">
                  <Label htmlFor="count" className="text-sm font-medium mb-2 block">
                    Number of variations to generate
                  </Label>
                  <Select
                    value={variationCount.toString()}
                    onValueChange={(value) => {
                      setVariationCount(parseInt(value));
                      setActiveVariationIndex(0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 variation</SelectItem>
                      <SelectItem value="2">2 variations</SelectItem>
                      <SelectItem value="3">3 variations</SelectItem>
                      <SelectItem value="4">4 variations</SelectItem>
                      <SelectItem value="5">5 variations</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-2">
                    Generate multiple variations to compare options
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Variation parameters */}
            <Card>
              <CardHeader>
                <CardTitle>2. Choose parameters to modify</CardTitle>
                <CardDescription>Select one or more aspects to vary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subject"
                      checked={variations.subject}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, subject: checked as boolean }))
                      }
                    />
                    <Label htmlFor="subject" className="cursor-pointer">
                      <span className="font-semibold">Character</span>
                      <span className="text-sm text-slate-500 block">Age, gender, ethnicity, appearance, clothing</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="location"
                      checked={variations.location}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, location: checked as boolean }))
                      }
                    />
                    <Label htmlFor="location" className="cursor-pointer">
                      <span className="font-semibold">Location & Scene</span>
                      <span className="text-sm text-slate-500 block">Location, time, weather, atmosphere</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="style"
                      checked={variations.style}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, style: checked as boolean }))
                      }
                    />
                    <Label htmlFor="style" className="cursor-pointer">
                      <span className="font-semibold">Cinematic Style</span>
                      <span className="text-sm text-slate-500 block">Shot type, angle, framing, movement</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipment"
                      checked={variations.equipment}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, equipment: checked as boolean }))
                      }
                    />
                    <Label htmlFor="equipment" className="cursor-pointer">
                      <span className="font-semibold">Equipment</span>
                      <span className="text-sm text-slate-500 block">Camera, lens, technical settings</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lighting"
                      checked={variations.lighting}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, lighting: checked as boolean }))
                      }
                    />
                    <Label htmlFor="lighting" className="cursor-pointer">
                      <span className="font-semibold">Lighting</span>
                      <span className="text-sm text-slate-500 block">Type, quality, direction</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="action"
                      checked={variations.action}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, action: checked as boolean }))
                      }
                    />
                    <Label htmlFor="action" className="cursor-pointer">
                      <span className="font-semibold">Actions & Sequences</span>
                      <span className="text-sm text-slate-500 block">Timing, movements, transitions</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="audio"
                      checked={variations.audio}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, audio: checked as boolean }))
                      }
                    />
                    <Label htmlFor="audio" className="cursor-pointer">
                      <span className="font-semibold">Audio</span>
                      <span className="text-sm text-slate-500 block">Sound ambiance, musical style</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="technical"
                      checked={variations.technical}
                      onCheckedChange={(checked) => 
                        setVariations(prev => ({ ...prev, technical: checked as boolean }))
                      }
                    />
                    <Label htmlFor="technical" className="cursor-pointer">
                      <span className="font-semibold">Technical Specifications</span>
                      <span className="text-sm text-slate-500 block">Resolution, FPS, format</span>
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !selectedPromptId}
                  className="w-full mt-6"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate {variationCount > 1 ? `${variationCount} variations` : 'the variation'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {generatedResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original Prompt */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Original Prompt</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(generatedResult.original)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(generatedResult.original, "prompt_original.json")}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-50 p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                    {JSON.stringify(generatedResult.original, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Generated Variations */}
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      {generatedResult.variations.length > 1 
                        ? `Variation ${activeVariationIndex + 1} / ${generatedResult.variations.length}`
                        : "Generated Variation"
                      }
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(generatedResult.variations[activeVariationIndex].data)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(generatedResult.variations[activeVariationIndex].data, `prompt_variation_${activeVariationIndex + 1}.json`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Variation navigation */}
                  {generatedResult.variations.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveVariationIndex(Math.max(0, activeVariationIndex - 1))}
                        disabled={activeVariationIndex === 0}
                      >
                        ← Previous
                      </Button>
                      <div className="flex gap-1">
                        {generatedResult.variations.map((_: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setActiveVariationIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === activeVariationIndex 
                                ? 'bg-purple-600' 
                                : 'bg-purple-200 hover:bg-purple-400'
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveVariationIndex(Math.min(generatedResult.variations.length - 1, activeVariationIndex + 1))}
                        disabled={activeVariationIndex === generatedResult.variations.length - 1}
                      >
                        Next →
                      </Button>
                    </div>
                  )}
                  
                  <pre className="bg-white p-4 rounded-lg overflow-auto max-h-[600px] text-xs border-2 border-purple-200">
                    {JSON.stringify(generatedResult.variations[activeVariationIndex].data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}