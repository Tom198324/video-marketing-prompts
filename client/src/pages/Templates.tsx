import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, ShoppingBag, Home, Code, UtensilsCrossed, Shirt, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";

const industryIcons: Record<string, any> = {
  "E-commerce": ShoppingBag,
  "Real Estate": Home,
  "SaaS": Code,
  "Restaurant": UtensilsCrossed,
  "Fashion": Shirt,
};

const industryColors: Record<string, string> = {
  "E-commerce": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Real Estate": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "SaaS": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Restaurant": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Fashion": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

export default function Templates() {
  const [, navigate] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customizationData, setCustomizationData] = useState<Record<string, string>>({});
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  const { data: allTemplates, isLoading } = trpc.templates.list.useQuery();
  
  const savePromptMutation = trpc.library.savePrompt.useMutation({
    onSuccess: () => {
      toast.success("Prompt saved to your library!");
      setSelectedTemplate(null);
      setCustomizationData({});
      navigate("/my-prompts");
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const industries = allTemplates
    ? Array.from(new Set(allTemplates.map(t => t.industry)))
    : [];

  const filteredTemplates = allTemplates?.filter(t => 
    selectedIndustry === "all" || t.industry === selectedIndustry
  );

  const extractPlaceholders = (templateJson: any): string[] => {
    const placeholders: string[] = [];
    const jsonString = JSON.stringify(templateJson);
    const regex = /\[([A-Z_]+)(?:: ([^\]]+))?\]/g;
    let match;
    
    while ((match = regex.exec(jsonString)) !== null) {
      const placeholder = match[1];
      if (!placeholders.includes(placeholder)) {
        placeholders.push(placeholder);
      }
    }
    
    return placeholders;
  };

  const replacePlaceholders = (templateJson: any, data: Record<string, string>): any => {
    let jsonString = JSON.stringify(templateJson);
    
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`\\[${key}(?:: [^\\]]+)?\\]`, 'g');
      jsonString = jsonString.replace(regex, value);
    });
    
    return JSON.parse(jsonString);
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCustomizationData({});
  };

  const handleSaveCustomized = () => {
    if (!selectedTemplate) return;
    
    const placeholders = extractPlaceholders(selectedTemplate.templateJson);
    const missingFields = placeholders.filter(p => !customizationData[p]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    
    const customizedPrompt = replacePlaceholders(
      selectedTemplate.templateJson,
      customizationData
    );
    
    savePromptMutation.mutate({
      title: `${selectedTemplate.title} - ${new Date().toLocaleDateString()}`,
      promptJson: customizedPrompt,
      tags: `${selectedTemplate.industry}, ${selectedTemplate.useCase}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">Loading templates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold">Prompt Templates</h1>
        </div>
        <p className="text-muted-foreground">
          Industry-specific templates to kickstart your video prompts
        </p>
      </div>

      {/* Industry Filter Tabs */}
      <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="mb-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Industries</TabsTrigger>
          {industries.map(industry => (
            <TabsTrigger key={industry} value={industry}>
              {industry}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates?.map((template) => {
          const Icon = industryIcons[template.industry] || Sparkles;
          const colorClass = industryColors[template.industry] || "bg-gray-100 text-gray-700";
          
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{template.industry}</Badge>
                </div>
                <CardTitle className="text-xl">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <strong>Use Case:</strong> {template.useCase}
                  </div>
                  <Button 
                    onClick={() => handleUseTemplate(template)}
                    className="w-full"
                  >
                    Use This Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customization Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Template: {selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Fill in the placeholders below to customize your prompt. Each field has a suggested example to guide you.
              </p>
              
              {extractPlaceholders(selectedTemplate.templateJson).map((placeholder) => {
                // Extract example from template
                const jsonString = JSON.stringify(selectedTemplate.templateJson);
                const regex = new RegExp(`\\[${placeholder}: ([^\\]]+)\\]`);
                const match = jsonString.match(regex);
                const example = match ? match[1] : "";
                
                return (
                  <div key={placeholder} className="space-y-2">
                    <Label htmlFor={placeholder}>
                      {placeholder.replace(/_/g, " ")}
                      {example && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (e.g., {example})
                        </span>
                      )}
                    </Label>
                    <Input
                      id={placeholder}
                      placeholder={example || `Enter ${placeholder.toLowerCase().replace(/_/g, " ")}`}
                      value={customizationData[placeholder] || ""}
                      onChange={(e) => setCustomizationData(prev => ({
                        ...prev,
                        [placeholder]: e.target.value
                      }))}
                    />
                  </div>
                );
              })}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveCustomized}
                  disabled={savePromptMutation.isPending}
                  className="flex-1"
                >
                  {savePromptMutation.isPending ? "Saving..." : "Save to My Prompts"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
