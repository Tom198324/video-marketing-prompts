import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Compare from "./pages/Compare";
import PromptDetail from "./pages/PromptDetail";
import Documentation from "./pages/Documentation";
import Gallery from "./pages/Gallery";
import Customizer from "./pages/Customizer";
import Production from "./pages/Production";
import Optimize from "./pages/Optimize";
import BeforeAfter from "./pages/BeforeAfter";
import ExcellenceGuide from "./pages/ExcellenceGuide";
import Validator from "./pages/Validator";
import BatchValidator from "./pages/BatchValidator";
import PromptsStudio from "./pages/PromptsStudio";
import MyPromptDetail from "./pages/MyPromptDetail";
import Templates from "./pages/Templates";
import ToneGuide from "./pages/ToneGuide";
import ToneExamples from "./pages/ToneExamples";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/production"} component={Production} />
      {/* Legacy redirect */}
      <Route path={"/prompts"} component={Production} />
      <Route path={"/compare"} component={Compare} />
      <Route path="/prompt/:promptNumber" component={PromptDetail} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/customizer" component={Customizer} />
      {/* Legacy redirect */}
      <Route path="/generator" component={Customizer} />
      <Route path="/optimize" component={Optimize} />
      <Route path="/before-after" component={BeforeAfter} />
      <Route path="/excellence-guide" component={ExcellenceGuide} />
      <Route path="/validator" component={Validator} />
      <Route path="/batch-validator" component={BatchValidator} />
      <Route path="/prompts-studio" component={PromptsStudio} />
      {/* Legacy redirect */}
      <Route path="/my-prompts" component={PromptsStudio} />
      <Route path="/my-prompt/:id" component={MyPromptDetail} />
        <Route path="/templates" component={Templates} />
        <Route path="/tone-guide" component={ToneGuide} />
        <Route path="/tone-examples" component={ToneExamples} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
