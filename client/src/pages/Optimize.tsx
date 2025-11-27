import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, TrendingUp, CheckCircle2, AlertCircle, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function Optimize() {
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  const { data: prompts, isLoading: promptsLoading } = trpc.prompts.list.useQuery();
  
  const analyzeMutation = trpc.generator.analyzePrompt.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      setOptimizedResult(null);
      toast.success("✅ Analysis completed successfully!");
    },
    onError: (error) => {
      toast.error(`❌ Analysis error: ${error.message}`);
    },
  });

  const optimizeMutation = trpc.generator.optimizePrompt.useMutation({
    onSuccess: (data) => {
      setOptimizedResult(data);
      toast.success("✅ Optimization completed successfully!");
    },
    onError: (error) => {
      toast.error(`❌ Optimization error: ${error.message}`);
    },
  });

  const handleAnalyze = () => {
    if (!selectedPromptId) {
      toast.error("⚠️ Please select a prompt to analyze");
      return;
    }
    setAnalysisResult(null);
    setOptimizedResult(null);
    analyzeMutation.mutate({ promptId: selectedPromptId });
  };

  const handleOptimize = () => {
    if (!selectedPromptId) {
      toast.error("⚠️ Please select a prompt");
      return;
    }
    optimizeMutation.mutate({ promptId: selectedPromptId });
  };

  const handleCopy = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    toast.success("✅ Copied to clipboard");
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
    toast.success(`✅ Downloaded ${filename}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Prompt Optimizer
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-indigo-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Analyze and Optimize Your Prompts</CardTitle>
              <CardDescription className="text-base">
                Get detailed analysis across 8 critical sections and receive AI-powered optimization suggestions to improve coherence, technical accuracy, and creative quality.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Prompt Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Select a prompt to analyze</CardTitle>
              <CardDescription>Choose the prompt you want to evaluate and optimize</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {promptsLoading ? (
                  <div className="flex items-center justify-center py-8 w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <>
                    <Select
                      value={selectedPromptId?.toString() || ""}
                      onValueChange={(value) => {
                        setSelectedPromptId(parseInt(value));
                        setAnalysisResult(null);
                        setOptimizedResult(null);
                      }}
                    >
                      <SelectTrigger className="flex-1">
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
                    <Button 
                      onClick={handleAnalyze}
                      disabled={!selectedPromptId || analyzeMutation.isPending}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {analyzeMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Prompt
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="border-indigo-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Analysis Results</CardTitle>
                    <CardDescription>{analysisResult.promptTitle}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Overall Score</div>
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResult.analysis.overall_score)}`}>
                      {analysisResult.analysis.overall_score}/10
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Assessment */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Overall Assessment</h3>
                  <p className="text-slate-700">{analysisResult.analysis.overall_assessment}</p>
                </div>

                {/* Section Scores */}
                <div>
                  <h3 className="font-semibold mb-4">Section Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analysisResult.analysis.section_scores).map(([section, score]: [string, any]) => (
                      <div key={section} className="p-4 bg-white border rounded-lg">
                        <div className="text-sm text-slate-500 capitalize mb-1">
                          {section.replace(/_/g, ' ')}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                            {score}/10
                          </span>
                          <Badge className={getScoreBadge(score)}>
                            {score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : 'Needs Work'}
                          </Badge>
                        </div>
                        <Progress value={score * 10} className="mt-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Improvements */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Priority Improvements
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.analysis.priority_improvements.map((improvement: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-semibold text-amber-600 mt-0.5">{idx + 1}.</span>
                        <span className="text-slate-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Section Analysis */}
                <div>
                  <h3 className="font-semibold mb-4">Detailed Section Analysis</h3>
                  <Tabs defaultValue="shot" className="w-full">
                    <TabsList className="grid grid-cols-4 lg:grid-cols-8">
                      {Object.keys(analysisResult.analysis.section_analysis).map((section) => (
                        <TabsTrigger key={section} value={section} className="text-xs">
                          {section.split('_')[0]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(analysisResult.analysis.section_analysis).map(([section, data]: [string, any]) => (
                      <TabsContent key={section} value={section} className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Strengths
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {data.strengths.map((item: string, idx: number) => (
                                <li key={idx} className="text-green-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Weaknesses
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {data.weaknesses.map((item: string, idx: number) => (
                                <li key={idx} className="text-red-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Suggestions
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {data.suggestions.map((item: string, idx: number) => (
                                <li key={idx} className="text-blue-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Optimize Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleOptimize}
                    disabled={optimizeMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {optimizeMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating Optimized Version...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Generate Optimized Prompt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimized Results */}
          {optimizedResult && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">Optimized Prompt Generated</CardTitle>
                <CardDescription>Compare the original and optimized versions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="optimized" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="original">Original</TabsTrigger>
                    <TabsTrigger value="optimized">Optimized</TabsTrigger>
                  </TabsList>
                  <TabsContent value="original" className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Original Prompt JSON</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(optimizedResult.original)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(optimizedResult.original, 'original-prompt.json')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(optimizedResult.original, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="optimized" className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-green-800">Optimized Prompt JSON</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(optimizedResult.optimized)}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(optimizedResult.optimized, 'optimized-prompt.json')}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <pre className="bg-green-50 p-4 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(optimizedResult.optimized, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
