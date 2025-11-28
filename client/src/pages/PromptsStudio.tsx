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
  const [location, setLocation] = useLocation();
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "customizer") return "customizer";
    if (tab === "optimizer") return "optimizer";
    if (tab === "validator") return "validator";
    return "my-prompts";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "my-prompts") {
      setLocation("/prompts-studio");
    } else {
      setLocation(`/prompts-studio?tab=${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-14 bg-transparent border-0 w-full justify-start gap-4">
              <TabsTrigger 
                value="my-prompts" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <Folder className="h-4 w-4 mr-2" />
                My Prompts
              </TabsTrigger>
              <TabsTrigger 
                value="customizer" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Customizer
              </TabsTrigger>
              <TabsTrigger 
                value="optimizer" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Optimizer
              </TabsTrigger>
              <TabsTrigger 
                value="validator" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-full"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Validator
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} className="w-full">
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
