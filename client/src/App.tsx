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
import Generator from "./pages/Generator";
import Prompts from "./pages/Prompts";
import Optimize from "./pages/Optimize";
import BeforeAfter from "./pages/BeforeAfter";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/prompts"} component={Prompts} />
      <Route path={"/compare"} component={Compare} />
      <Route path="/prompt/:promptNumber" component={PromptDetail} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/generator" component={Generator} />
      <Route path="/optimize" component={Optimize} />
      <Route path="/before-after" component={BeforeAfter} />
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
