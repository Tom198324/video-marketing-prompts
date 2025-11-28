import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, Copy, Download, Send, Bot, AlertCircle, CheckCircle2, MinusCircle, Save } from "lucide-react";
import { toast } from "sonner";

const TONE_OPTIONS = [
  "Cinematic", "Energetic", "Luxury", "Minimalist", "Playful", "Professional",
  "Nostalgic", "Futuristic", "Emotional", "Bold", "Elegant", "Dramatic"
];

export default function Customizer() {
  // Mode selection
  const [mode, setMode] = useState<"modify" | "create">("modify");
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);

  // Mandatory fields
  const [promptName, setPromptName] = useState("");
  const [videoObjectives, setVideoObjectives] = useState("");

  // Tone & Atmosphere (mandatory)
  const [primaryTone, setPrimaryTone] = useState("");
  const [moodKeywords, setMoodKeywords] = useState<string[]>(["", "", "", ""]);
  const [emotionalArc, setEmotionalArc] = useState("");
  const [appearance, setAppearance] = useState("");
  const [clothing, setClothing] = useState("");
  const [secondaryTone, setSecondaryTone] = useState("");
  const [visualStyleRef, setVisualStyleRef] = useState("");

  // Character (optional)
  const [charAge, setCharAge] = useState("");
  const [charGender, setCharGender] = useState("");
  const [charEthnicity, setCharEthnicity] = useState("");
  const [charAppearance, setCharAppearance] = useState("");
  const [charClothing, setCharClothing] = useState("");

  // Location & Scene (optional)
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  // Cinematic Style (optional)
  const [shotType, setShotType] = useState("");
  const [angle, setAngle] = useState("");
  const [framing, setFraming] = useState("");
  const [movement, setMovement] = useState("");

  // Action & Sequences (optional)
  const [movements, setMovements] = useState("");
  const [actions, setActions] = useState("");
  const [sequencesTiming, setSequencesTiming] = useState("");

  // Generated result
  const [generatedPrompt, setGeneratedPrompt] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Save dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTags, setSaveTags] = useState("");

  const { data: prompts, isLoading: promptsLoading } = trpc.prompts.list.useQuery();
  const generateMutation = trpc.customizer.generatePrompt.useMutation({
    onSuccess: (data) => {
      setGeneratedPrompt(data);
      setShowPreview(true);
      toast.success("✅ Professional prompt generated successfully!");
    },
    onError: (error) => {
      toast.error(`❌ Generation error: ${error.message}`);
    },
  });

  const saveMutation = trpc.myPrompts.saveFromCustomizer.useMutation({
    onSuccess: (data: { success: boolean; id: number }) => {
      toast.success("✅ Prompt saved to My Prompts!");
      setShowSaveDialog(false);
      setSaveTags("");
    },
    onError: (error: any) => {
      toast.error(`❌ Save error: ${error.message}`);
    },
  });

  // Validation
  const isMandatoryComplete = () => {
    return (
      promptName.trim() !== "" &&
      videoObjectives.trim().length >= 200 &&
      primaryTone !== "" &&
      moodKeywords.filter(k => k.trim() !== "").length >= 4 &&
      emotionalArc.trim() !== "" &&
      appearance.trim() !== "" &&
      clothing.trim() !== ""
    );
  };

  const getSectionStatus = (section: string) => {
    switch (section) {
      case "tone":
        return isMandatoryComplete() ? "complete" : "incomplete";
      case "character":
        const charFilled = [charAge, charGender, charEthnicity, charAppearance, charClothing].filter(f => f.trim() !== "").length;
        return charFilled === 0 ? "empty" : charFilled === 5 ? "complete" : "partial";
      case "location":
        const locFilled = [location, time, weather, atmosphere].filter(f => f.trim() !== "").length;
        return locFilled === 0 ? "empty" : locFilled === 4 ? "complete" : "partial";
      case "cinematic":
        const cinFilled = [shotType, angle, framing, movement].filter(f => f.trim() !== "").length;
        return cinFilled === 0 ? "empty" : cinFilled === 4 ? "complete" : "partial";
      case "action":
        const actFilled = [movements, actions, sequencesTiming].filter(f => f.trim() !== "").length;
        return actFilled === 0 ? "empty" : actFilled === 3 ? "complete" : "partial";
      default:
        return "ai";
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "complete") return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Complete</Badge>;
    if (status === "partial") return <Badge className="bg-orange-500"><MinusCircle className="h-3 w-3 mr-1" />Partial</Badge>;
    if (status === "incomplete") return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Required</Badge>;
    if (status === "ai") return <Badge className="bg-purple-500"><Bot className="h-3 w-3 mr-1" />AI Generated</Badge>;
    return <Badge variant="outline"><MinusCircle className="h-3 w-3 mr-1" />Empty</Badge>;
  };

  const handleGenerate = () => {
    if (!isMandatoryComplete()) {
      toast.error("⚠️ Please complete all mandatory fields");
      return;
    }

    generateMutation.mutate({
      mode,
      basePromptId: mode === "modify" && selectedPromptId !== null ? selectedPromptId : undefined,
      promptName,
      videoObjectives,
      userInputs: {
        tone: {
          primary: primaryTone,
          moodKeywords: moodKeywords.filter(k => k.trim() !== ""),
          emotionalArc,
          appearance,
          clothing,
          secondary: secondaryTone || undefined,
          visualStyle: visualStyleRef || undefined,
        },
        character: (charAge || charGender || charEthnicity || charAppearance || charClothing) ? {
          age: charAge || undefined,
          gender: charGender || undefined,
          ethnicity: charEthnicity || undefined,
          appearance: charAppearance || undefined,
          clothing: charClothing || undefined,
        } : undefined,
        location: (location || time || weather || atmosphere) ? {
          location: location || undefined,
          time: time || undefined,
          weather: weather || undefined,
          atmosphere: atmosphere || undefined,
        } : undefined,
        cinematic: (shotType || angle || framing || movement) ? {
          shotType: shotType || undefined,
          angle: angle || undefined,
          framing: framing || undefined,
          movement: movement || undefined,
        } : undefined,
        action: (movements || actions || sequencesTiming) ? {
          movements: movements || undefined,
          actions: actions || undefined,
          sequencesTiming: sequencesTiming || undefined,
        } : undefined,
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedPrompt, null, 2));
    toast.success("✅ Copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(generatedPrompt, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${promptName.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("✅ Download started");
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    saveMutation.mutate({
      promptName,
      promptJson: JSON.stringify(generatedPrompt, null, 2),
      tags: saveTags || undefined,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Professional Customizer</h1>
        <p className="text-lg text-slate-600">
          Create or modify video prompts with AI-powered professional guidance
        </p>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Choose Your Approach</CardTitle>
          <CardDescription>Start from an existing prompt or create a new one from scratch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as "modify" | "create")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="modify" id="modify" />
              <Label htmlFor="modify" className="cursor-pointer">Modify existing prompt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="create" id="create" />
              <Label htmlFor="create" className="cursor-pointer">Create from scratch</Label>
            </div>
          </RadioGroup>

          {mode === "modify" && (
            <div className="space-y-2">
              <Label>Select Base Prompt</Label>
              <Select value={selectedPromptId?.toString()} onValueChange={(v) => setSelectedPromptId(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prompt to modify" />
                </SelectTrigger>
                <SelectContent>
                  {promptsLoading && <SelectItem value="loading">Loading prompts...</SelectItem>}
                  {prompts?.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id.toString()}>
                      {prompt.title} - {prompt.industrySector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mandatory Fields */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-indigo-600" />
            Step 2: Essential Information (Required)
          </CardTitle>
          <CardDescription>These fields are mandatory to generate a professional prompt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptName">Prompt Name *</Label>
            <Input
              id="promptName"
              placeholder="e.g., Luxury Watch Commercial - Urban Lifestyle"
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
              className={promptName.trim() === "" ? "border-red-300" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoObjectives">Video Objectives * (minimum 200 characters)</Label>
            <Textarea
              id="videoObjectives"
              placeholder="Describe the goals, target audience, key message, and desired emotional impact of the video..."
              value={videoObjectives}
              onChange={(e) => setVideoObjectives(e.target.value)}
              rows={4}
              className={videoObjectives.trim().length < 200 ? "border-red-300" : ""}
            />
            <p className="text-sm text-slate-500">
              {videoObjectives.length}/200 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Configure Prompt Sections</CardTitle>
          <CardDescription>
            Fill mandatory sections, customize optional ones, or let AI handle them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {/* Tone & Atmosphere - MANDATORY */}
            <AccordionItem value="tone" className="border border-indigo-200 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">1. Tone & Atmosphere</span>
                  <StatusBadge status={getSectionStatus("tone")} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    All fields in this section are <strong>mandatory</strong>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Tone *</Label>
                    <Select value={primaryTone} onValueChange={setPrimaryTone}>
                      <SelectTrigger className={primaryTone === "" ? "border-red-300" : ""}>
                        <SelectValue placeholder="Select primary tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONE_OPTIONS.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Secondary Tone (Optional)</Label>
                    <Select value={secondaryTone} onValueChange={setSecondaryTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONE_OPTIONS.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mood Keywords * (minimum 4)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {moodKeywords.map((keyword, idx) => (
                      <Input
                        key={idx}
                        placeholder={`Keyword ${idx + 1}`}
                        value={keyword}
                        onChange={(e) => {
                          const newKeywords = [...moodKeywords];
                          newKeywords[idx] = e.target.value;
                          setMoodKeywords(newKeywords);
                        }}
                        className={keyword.trim() === "" ? "border-red-300" : ""}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emotional Arc *</Label>
                  <Textarea
                    placeholder="Describe how emotions evolve throughout the video..."
                    value={emotionalArc}
                    onChange={(e) => setEmotionalArc(e.target.value)}
                    rows={3}
                    className={emotionalArc.trim() === "" ? "border-red-300" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Appearance *</Label>
                  <Textarea
                    placeholder="Describe the visual appearance and aesthetic..."
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    rows={3}
                    className={appearance.trim() === "" ? "border-red-300" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Clothing *</Label>
                  <Textarea
                    placeholder="Describe clothing style and details..."
                    value={clothing}
                    onChange={(e) => setClothing(e.target.value)}
                    rows={3}
                    className={clothing.trim() === "" ? "border-red-300" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Visual Style Reference (Optional)</Label>
                  <Textarea
                    placeholder="Reference films, photographers, or visual styles..."
                    value={visualStyleRef}
                    onChange={(e) => setVisualStyleRef(e.target.value)}
                    rows={2}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Character - OPTIONAL */}
            <AccordionItem value="character" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">2. Character</span>
                  <StatusBadge status={getSectionStatus("character")} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Optional section - AI will auto-fill empty fields based on best practices
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input placeholder="e.g., Mid-30s" value={charAge} onChange={(e) => setCharAge(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Input placeholder="e.g., Female" value={charGender} onChange={(e) => setCharGender(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Ethnicity</Label>
                    <Input placeholder="e.g., Asian" value={charEthnicity} onChange={(e) => setCharEthnicity(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Appearance</Label>
                  <Textarea
                    placeholder="Describe physical appearance, style, and distinctive features..."
                    value={charAppearance}
                    onChange={(e) => setCharAppearance(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Clothing</Label>
                  <Textarea
                    placeholder="Describe clothing style, colors, and details..."
                    value={charClothing}
                    onChange={(e) => setCharClothing(e.target.value)}
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location & Scene - OPTIONAL */}
            <AccordionItem value="location" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">3. Location & Scene</span>
                  <StatusBadge status={getSectionStatus("location")} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Optional section - AI will auto-fill empty fields based on best practices
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="e.g., Modern office, Urban street" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input placeholder="e.g., Golden hour, Night" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Weather</Label>
                    <Input placeholder="e.g., Clear sky, Light rain" value={weather} onChange={(e) => setWeather(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Atmosphere</Label>
                  <Textarea
                    placeholder="Describe the overall mood and atmosphere of the scene..."
                    value={atmosphere}
                    onChange={(e) => setAtmosphere(e.target.value)}
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Cinematic Style - OPTIONAL */}
            <AccordionItem value="cinematic" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">4. Cinematic Style</span>
                  <StatusBadge status={getSectionStatus("cinematic")} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Optional section - AI will auto-fill empty fields based on best practices
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shot Type</Label>
                    <Input placeholder="e.g., Close-up, Wide shot" value={shotType} onChange={(e) => setShotType(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Angle</Label>
                    <Input placeholder="e.g., Eye level, Low angle" value={angle} onChange={(e) => setAngle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Framing</Label>
                    <Input placeholder="e.g., Rule of thirds, Centered" value={framing} onChange={(e) => setFraming(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Movement</Label>
                    <Input placeholder="e.g., Tracking shot, Static" value={movement} onChange={(e) => setMovement(e.target.value)} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Equipment - READ-ONLY */}
            <AccordionItem value="equipment" className="border border-purple-200 rounded-lg px-4 bg-purple-50">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">5. Equipment</span>
                  <StatusBadge status="ai" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Alert className="bg-purple-100 border-purple-300">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>AI-Generated Section</strong> - Requires professional expertise. This section will be automatically filled by AI based on industry best practices.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Lighting - READ-ONLY */}
            <AccordionItem value="lighting" className="border border-purple-200 rounded-lg px-4 bg-purple-50">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">6. Lighting</span>
                  <StatusBadge status="ai" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Alert className="bg-purple-100 border-purple-300">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>AI-Generated Section</strong> - Requires professional expertise. This section will be automatically filled by AI based on industry best practices.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Action & Sequences - OPTIONAL */}
            <AccordionItem value="action" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">7. Action & Sequences</span>
                  <StatusBadge status={getSectionStatus("action")} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Optional section - AI will auto-fill empty fields based on best practices
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Movements</Label>
                  <Textarea
                    placeholder="Describe character and camera movements..."
                    value={movements}
                    onChange={(e) => setMovements(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <Textarea
                    placeholder="Describe key actions and interactions..."
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sequences Timing</Label>
                  <Textarea
                    placeholder="Describe timing and pacing of sequences..."
                    value={sequencesTiming}
                    onChange={(e) => setSequencesTiming(e.target.value)}
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Audio - READ-ONLY */}
            <AccordionItem value="audio" className="border border-purple-200 rounded-lg px-4 bg-purple-50">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">8. Audio</span>
                  <StatusBadge status="ai" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Alert className="bg-purple-100 border-purple-300">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>AI-Generated Section</strong> - Requires professional expertise. This section will be automatically filled by AI based on industry best practices.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Technical Specifications - READ-ONLY */}
            <AccordionItem value="technical" className="border border-purple-200 rounded-lg px-4 bg-purple-50">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold">9. Technical Specifications</span>
                  <StatusBadge status="ai" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Alert className="bg-purple-100 border-purple-300">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>AI-Generated Section</strong> - Requires professional expertise. This section will be automatically filled by AI based on industry best practices.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="pt-6">
          <Button
            onClick={handleGenerate}
            disabled={!isMandatoryComplete() || generateMutation.isPending}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Professional Prompt...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Professional Prompt
              </>
            )}
          </Button>
          {!isMandatoryComplete() && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please complete all mandatory fields to generate
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preview & Export */}
      {showPreview && generatedPrompt && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Generated Prompt Preview
            </CardTitle>
            <CardDescription>Your professional video prompt is ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
              <pre className="text-sm">{JSON.stringify(generatedPrompt, null, 2)}</pre>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopy} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Send to Validator
              </Button>
              <Button onClick={handleSave} variant="outline" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save to My Prompts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to My Prompts</DialogTitle>
            <DialogDescription>
              Add optional tags to help organize and find this prompt later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="e.g., luxury, product-launch, automotive"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
              />
              <p className="text-sm text-slate-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Prompt Name:</strong> {promptName}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
