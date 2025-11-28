import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload, FileJson, CheckCircle, XCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QualityBadge } from "@/components/QualityBadge";
import Header from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BatchValidator() {
  const [batchResults, setBatchResults] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const validateMutation = trpc.generator.validateBatchPrompts.useMutation({
    onSuccess: (data) => {
      setBatchResults(data);
      toast.success(`✅ Batch validation complete - ${data.summary.successful}/${data.summary.total} prompts validated`);
    },
    onError: (error) => {
      toast.error(`❌ Validation error: ${error.message}`);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      
      try {
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          toast.error("❌ File must contain a JSON array of prompts");
          return;
        }
        toast.success(`✅ File loaded - ${parsed.length} prompts found`);
      } catch (error) {
        toast.error("❌ Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleValidate = () => {
    if (!fileContent) {
      toast.error("⚠️ No file loaded - Please upload a JSON file");
      return;
    }

    try {
      const parsed = JSON.parse(fileContent);
      if (!Array.isArray(parsed)) {
        toast.error("❌ File must contain a JSON array");
        return;
      }

      // Convert to expected format
      const prompts = parsed.map((item, idx) => ({
        title: item.title || `Prompt ${idx + 1}`,
        promptText: JSON.stringify(item.prompt || item),
      }));

      validateMutation.mutate({ prompts });
    } catch (error) {
      toast.error("❌ Failed to parse JSON file");
    }
  };

  const getStatusIcon = (success: boolean, score?: number) => {
    if (!success) return <XCircle className="h-5 w-5 text-red-600" />;
    if (score && score >= 9) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score && score >= 7) return <CheckCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="h-6 w-6 text-purple-600" />
            Batch Validation
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Validate multiple prompts at once</CardTitle>
              <CardDescription className="text-base">
                Upload a JSON file containing an array of prompts and receive a comprehensive quality report for all of them. 
                Perfect for validating entire prompt libraries or batch-generated content.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload JSON File</CardTitle>
                <CardDescription>Select a file containing an array of prompt objects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileJson className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      JSON file with array of prompts
                    </p>
                  </label>
                </div>

                {fileContent && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>File loaded successfully</AlertTitle>
                    <AlertDescription>
                      {JSON.parse(fileContent).length} prompts ready for validation
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleValidate}
                  disabled={validateMutation.isPending || !fileContent}
                  className="w-full"
                  size="lg"
                >
                  {validateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Validate All Prompts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Expected Format */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle>Expected JSON Format</CardTitle>
                <CardDescription>Your file should follow this structure</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`[
  {
    "title": "Prompt 1 Title",
    "prompt": {
      "shot": {...},
      "subject": {...},
      "action": {...},
      "scene": {...},
      "cinematography": {...},
      "audio": {...},
      "visual_rules": {...},
      "technical_specifications": {...}
    }
  },
  {
    "title": "Prompt 2 Title",
    "prompt": {...}
  }
]`}
                </pre>
                <p className="text-xs text-slate-500 mt-4">
                  Each prompt must include all 8 mandatory sections. The "title" field is optional.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {batchResults && (
            <div className="space-y-6">
              {/* Summary Statistics */}
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    Validation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{batchResults.summary.total}</p>
                      <p className="text-sm text-slate-600">Total Prompts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{batchResults.summary.successful}</p>
                      <p className="text-sm text-slate-600">Successfully Validated</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{batchResults.summary.averageScore}</p>
                      <p className="text-sm text-slate-600">Average Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600">{batchResults.summary.needsOptimization}</p>
                      <p className="text-sm text-slate-600">Need Optimization</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">Quality Distribution</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-yellow-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-800">{batchResults.summary.distribution.gold}</p>
                        <p className="text-xs text-yellow-700">Gold (9-10)</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-800">{batchResults.summary.distribution.silver}</p>
                        <p className="text-xs text-gray-700">Silver (7-8.9)</p>
                      </div>
                      <div className="bg-orange-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-800">{batchResults.summary.distribution.bronze}</p>
                        <p className="text-xs text-orange-700">Bronze (5-6.9)</p>
                      </div>
                      <div className="bg-red-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-800">{batchResults.summary.distribution.poor}</p>
                        <p className="text-xs text-red-700">Poor (&lt;5)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Results</CardTitle>
                  <CardDescription>Individual validation results for each prompt</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-center">Quality</TableHead>
                        <TableHead>Assessment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchResults.results.map((result: any) => (
                        <TableRow key={result.index}>
                          <TableCell className="font-medium">{result.index + 1}</TableCell>
                          <TableCell className="font-medium">{result.title}</TableCell>
                          <TableCell className="text-center">
                            {getStatusIcon(result.success, result.analysis?.overall_score)}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.success ? (
                              <span className="text-lg font-bold">{result.analysis.overall_score}/10</span>
                            ) : (
                              <span className="text-red-600 text-sm">Error</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.success && result.analysis ? (
                              <QualityBadge score={result.analysis.overall_score} size="sm" />
                            ) : (
                              <span className="text-xs text-red-600">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {result.success ? (
                              <span className="text-slate-600">
                                {result.analysis.overall_assessment.substring(0, 100)}...
                              </span>
                            ) : (
                              <span className="text-red-600">{result.error}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Prompts Needing Optimization */}
              {batchResults.summary.needsOptimization > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Prompts Requiring Optimization
                    </CardTitle>
                    <CardDescription>
                      {batchResults.summary.needsOptimization} prompt(s) scored below 7/10 and should be optimized
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {batchResults.results
                        .filter((r: any) => r.needsOptimization)
                        .map((result: any) => (
                          <li key={result.index} className="flex items-start gap-2">
                            <span className="bg-orange-200 text-orange-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                              {result.index + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-sm">{result.title}</p>
                              <p className="text-xs text-slate-600">
                                Score: {result.analysis.overall_score}/10 - {result.analysis.priority_improvements?.[0]}
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <Button asChild variant="outline">
                        <a href="/optimize">Use Optimizer Tool</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
