import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export default function Compare() {
  const [, setLocation] = useLocation();
  const [promptIds, setPromptIds] = useState<number[]>([]);

  useEffect(() => {
    // Get prompt IDs from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids");
    if (ids) {
      setPromptIds(ids.split(",").map(Number));
    } else {
      // If no IDs, redirect to prompts page
      setLocation("/prompts");
    }
  }, [setLocation]);

  const { data: prompts, isLoading } = trpc.prompts.getByIds.useQuery(
    { ids: promptIds },
    { enabled: promptIds.length > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container py-8 max-w-7xl mx-auto">
          <div className="text-center">Loading comparison...</div>
        </main>
      </div>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container py-8 max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No prompts selected for comparison</p>
            <Button onClick={() => setLocation("/prompts")}>
              Go to Prompts
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/prompts")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Prompts
            </Button>
            <h1 className="text-3xl font-bold">Compare Prompts</h1>
            <p className="text-muted-foreground mt-2">
              Side-by-side comparison of {prompts.length} selected prompts
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className={`grid gap-6 ${prompts.length === 2 ? "grid-cols-2" : prompts.length === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
          {prompts.map((prompt) => {
            const json = typeof prompt.promptJson === "string" 
              ? JSON.parse(prompt.promptJson) 
              : prompt.promptJson;

            return (
              <Card key={prompt.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{prompt.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{prompt.industrySector}</Badge>
                    <Badge variant="outline">{prompt.visualStyle}</Badge>
                    <Badge>{prompt.scenarioType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  {/* Camera System */}
                  <div>
                    <h3 className="font-semibold mb-2">Camera System</h3>
                    <p className="text-sm text-muted-foreground">
                      {json.cinematography?.camera_system || "N/A"}
                    </p>
                  </div>

                  <Separator />

                  {/* Primary Lens */}
                  <div>
                    <h3 className="font-semibold mb-2">Primary Lens</h3>
                    <p className="text-sm text-muted-foreground">
                      {json.cinematography?.primary_lens || "N/A"}
                    </p>
                  </div>

                  <Separator />

                  {/* Composition */}
                  <div>
                    <h3 className="font-semibold mb-2">Composition</h3>
                    <p className="text-sm text-muted-foreground">
                      {json.shot?.composition || "N/A"}
                    </p>
                  </div>

                  <Separator />

                  {/* Frame Rate & Aspect Ratio */}
                  <div>
                    <h3 className="font-semibold mb-2">Technical Specs</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Frame Rate:</span>
                        <p className="text-muted-foreground">{json.shot?.frame_rate || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Aspect Ratio:</span>
                        <p className="text-muted-foreground">{json.shot?.aspect_ratio || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sequences */}
                  <div>
                    <h3 className="font-semibold mb-3">Action Sequences</h3>
                    <div className="space-y-3">
                      {json.action?.sequences?.map((seq: any, idx: number) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium text-sm mb-1">
                            Sequence {idx + 1} ({seq.timing})
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {seq.primary_motion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Lighting */}
                  <div>
                    <h3 className="font-semibold mb-2">Lighting</h3>
                    <p className="text-sm text-muted-foreground">
                      {json.scene?.lighting?.source || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Color Temp: {json.scene?.lighting?.color_temperature || "N/A"}
                    </p>
                  </div>

                  <Separator />

                  {/* Duration */}
                  <div>
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p className="text-sm text-muted-foreground">
                      {prompt.originalDuration} seconds
                    </p>
                  </div>

                  {/* View Details Button */}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setLocation(`/prompt/${prompt.promptNumber}`)}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
