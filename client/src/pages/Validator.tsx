import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, ShieldCheck, AlertCircle, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QualityBadge } from "@/components/QualityBadge";

export default function Validator() {
  const [promptTitle, setPromptTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);

  const validateMutation = trpc.generator.validateCustomPrompt.useMutation({
    onSuccess: (data) => {
      setValidationResult(data);
      toast.success("✅ Validation complete - Your prompt has been evaluated");
    },
    onError: (error) => {
      toast.error(`❌ Validation error: ${error.message}`);
    },
  });

  const handleValidate = () => {
    if (!promptText.trim()) {
      toast.error("⚠️ No prompt provided - Please paste your JSON prompt");
      return;
    }

    validateMutation.mutate({
      promptText: promptText.trim(),
      title: promptTitle.trim() || undefined,
    });
  };

  const handleClear = () => {
    setPromptTitle("");
    setPromptText("");
    setValidationResult(null);
  };

  const getRecommendationIcon = (score: number) => {
    if (score >= 9) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 7) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    if (score >= 5) return <XCircle className="h-5 w-5 text-orange-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getRecommendationColor = (score: number) => {
    if (score >= 9) return "border-green-200 bg-green-50";
    if (score >= 7) return "border-yellow-200 bg-yellow-50";
    if (score >= 5) return "border-orange-200 bg-orange-50";
    return "border-red-200 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
            Strict Validation Mode
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Validate your custom prompts with ultra-demanding standards</CardTitle>
              <CardDescription className="text-base">
                Before generating videos, validate your custom prompts using our world-class cinematography expert evaluation system. 
                Get ruthlessly honest feedback on all 8 critical sections with automatic penalty detection.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Validation Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit your prompt for validation</CardTitle>
                <CardDescription>Paste your complete JSON prompt below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                    Prompt Title (optional)
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Premium Coffee Commercial"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                    JSON Prompt <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder='{"shot": {...}, "subject": {...}, "action": {...}, ...}'
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="font-mono text-sm min-h-[400px]"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Must include all 8 sections: shot, subject, action, scene, cinematography, audio, visual_rules, technical_specifications
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleValidate}
                    disabled={validateMutation.isPending || !promptText.trim()}
                    className="flex-1"
                    size="lg"
                  >
                    {validateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Validate Prompt
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="lg"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Standards */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle>Evaluation Standards</CardTitle>
                <CardDescription>Ultra-demanding criteria from Oscar-winning cinematographers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 text-yellow-800 font-bold rounded px-2 py-1 text-sm">10</div>
                    <div>
                      <p className="font-semibold text-sm">PERFECT</p>
                      <p className="text-xs text-slate-600">Worthy of Cannes Film Festival, zero improvements possible</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 text-yellow-800 font-bold rounded px-2 py-1 text-sm">9</div>
                    <div>
                      <p className="font-semibold text-sm">CINEMATIC EXCELLENCE</p>
                      <p className="text-xs text-slate-600">Hollywood/Pixar level, ready for Super Bowl commercial</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-200 text-gray-800 font-bold rounded px-2 py-1 text-sm">8</div>
                    <div>
                      <p className="font-semibold text-sm">PROFESSIONAL MASTERY</p>
                      <p className="text-xs text-slate-600">High-end production quality, minor refinements only</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-200 text-gray-800 font-bold rounded px-2 py-1 text-sm">7</div>
                    <div>
                      <p className="font-semibold text-sm">SOLID PROFESSIONAL</p>
                      <p className="text-xs text-slate-600">Good but needs optimization for premium use</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-200 text-orange-800 font-bold rounded px-2 py-1 text-sm">5-6</div>
                    <div>
                      <p className="font-semibold text-sm">MEDIOCRE/ACCEPTABLE</p>
                      <p className="text-xs text-slate-600">Multiple improvements required for professional standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-200 text-red-800 font-bold rounded px-2 py-1 text-sm">1-4</div>
                    <div>
                      <p className="font-semibold text-sm">POOR/UNACCEPTABLE</p>
                      <p className="text-xs text-slate-600">Fundamental flaws, complete redesign required</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="font-semibold text-sm mb-2">Automatic Penalties:</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Generic sequences ("Sequence 2", "showcase"): <span className="text-red-600 font-semibold">-5 pts</span></li>
                    <li>• Narrative incoherence: <span className="text-red-600 font-semibold">-3 pts</span></li>
                    <li>• Vague technical terms: <span className="text-red-600 font-semibold">-3 pts</span></li>
                    <li>• Missing emotional progression: <span className="text-red-600 font-semibold">-2 pts</span></li>
                    <li>• Visual/narrative clichés: <span className="text-red-600 font-semibold">-2 pts</span></li>
                    <li>• Imprecise timing: <span className="text-red-600 font-semibold">-2 pts</span></li>
                    <li>• Incomplete technical specs: <span className="text-red-600 font-semibold">-3 pts</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-6">
              {/* Overall Score & Recommendation */}
              <Card className={`border-2 ${getRecommendationColor(validationResult.analysis.overall_score)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      {getRecommendationIcon(validationResult.analysis.overall_score)}
                      Validation Result
                    </CardTitle>
                    <QualityBadge score={validationResult.analysis.overall_score} size="lg" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTitle className="text-lg font-bold">{validationResult.recommendation}</AlertTitle>
                    <AlertDescription className="text-base mt-2">
                      {validationResult.analysis.overall_assessment}
                    </AlertDescription>
                  </Alert>

                  {/* Penalties Applied */}
                  {validationResult.analysis.penalties_applied && validationResult.analysis.penalties_applied.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Automatic Penalties Applied
                      </h3>
                      <ul className="space-y-1">
                        {validationResult.analysis.penalties_applied.map((penalty: string, idx: number) => (
                          <li key={idx} className="text-sm text-red-800">• {penalty}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Section Scores (8 Critical Areas)</CardTitle>
                  <CardDescription>Detailed evaluation of each prompt component</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(validationResult.analysis.section_scores || {}).map(([section, score]: [string, any]) => (
                      <div key={section} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">{section.replace(/_/g, ' ')}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{score}</span>
                            <span className="text-sm text-slate-500">/10</span>
                          </div>
                        </div>
                        {validationResult.analysis.section_analysis?.[section] && (
                          <div className="space-y-2 text-sm">
                            {validationResult.analysis.section_analysis[section].strengths?.length > 0 && (
                              <div>
                                <p className="font-medium text-green-700">✓ Strengths:</p>
                                <ul className="text-xs text-slate-600 ml-4">
                                  {validationResult.analysis.section_analysis[section].strengths.map((s: string, i: number) => (
                                    <li key={i}>• {s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {validationResult.analysis.section_analysis[section].weaknesses?.length > 0 && (
                              <div>
                                <p className="font-medium text-red-700">✗ Weaknesses:</p>
                                <ul className="text-xs text-slate-600 ml-4">
                                  {validationResult.analysis.section_analysis[section].weaknesses.map((w: string, i: number) => (
                                    <li key={i}>• {w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Improvements */}
              {validationResult.analysis.priority_improvements && validationResult.analysis.priority_improvements.length > 0 && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Priority Improvements
                    </CardTitle>
                    <CardDescription>Critical issues to address for higher quality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {validationResult.analysis.priority_improvements.map((improvement: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="bg-orange-100 text-orange-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-slate-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {validationResult.analysis.overall_score >= 9 ? (
                    <p className="text-sm">
                      🎉 <strong>Congratulations!</strong> Your prompt meets cinematic excellence standards. 
                      You can proceed to video generation with confidence.
                    </p>
                  ) : validationResult.analysis.overall_score >= 7 ? (
                    <p className="text-sm">
                      ✅ Your prompt is solid but could benefit from minor refinements. 
                      Review the priority improvements above and consider using our <a href="/optimize" className="text-purple-600 underline">Optimizer</a> tool.
                    </p>
                  ) : validationResult.analysis.overall_score >= 5 ? (
                    <p className="text-sm">
                      ⚠️ Your prompt needs significant improvements before video generation. 
                      We strongly recommend using our <a href="/optimize" className="text-purple-600 underline">Optimizer</a> tool to transform it to 9-10/10 quality.
                    </p>
                  ) : (
                    <p className="text-sm">
                      🚫 Your prompt has fundamental flaws and requires complete reconstruction. 
                      Please review the <a href="/excellence-guide" className="text-purple-600 underline">Excellence Guide</a> and start fresh, 
                      or use our <a href="/optimize" className="text-purple-600 underline">Optimizer</a> tool for a complete transformation.
                    </p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={handleClear}>
                      Validate Another Prompt
                    </Button>
                    <Button asChild>
                      <a href="/excellence-guide">View Excellence Guide</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
