import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Wand2, Zap, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import { useLocation } from "wouter";

// Import sub-pages
import MyPromptsContent from "@/components/studio/MyPromptsContent";
import Customizer from "./Customizer";
import Optimize from "./Optimize";
import Validator from "./Validator";

export default function PromptsStudio() {
  const [location] = useLocation();
  
  // Determine active tab from URL
  const getActiveTab = () => {
    if (location.includes("/prompts-studio/customizer")) return "customizer";
    if (location.includes("/prompts-studio/optimizer")) return "optimizer";
    if (location.includes("/prompts-studio/validator")) return "validator";
    return "my-prompts";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Prompts Studio</h1>
          <p className="text-slate-600">Create, customize, optimize, and validate your video prompts</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={getActiveTab()} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-8">
            <TabsTrigger value="my-prompts" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              My Prompts
            </TabsTrigger>
            <TabsTrigger value="customizer" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Customizer
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Optimizer
            </TabsTrigger>
            <TabsTrigger value="validator" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Validator
            </TabsTrigger>
          </TabsList>

          {/* My Prompts Tab */}
          <TabsContent value="my-prompts">
            <MyPromptsContent />
          </TabsContent>

          {/* Customizer Tab */}
          <TabsContent value="customizer">
            <Customizer />
          </TabsContent>

          {/* Optimizer Tab */}
          <TabsContent value="optimizer">
            <Optimize />
          </TabsContent>

          {/* Validator Tab */}
          <TabsContent value="validator">
            <Validator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
