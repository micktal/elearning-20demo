import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModuleProgressProvider } from "@/providers/ModuleProgressProvider";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingIntro from "./pages/Onboarding";
import OnboardingProtocols from "./pages/OnboardingProtocols";
import OnboardingSimulations from "./pages/OnboardingSimulations";
import OnboardingConflicts from "./pages/OnboardingConflicts";
import OnboardingFire from "./pages/OnboardingFire";
import OnboardingPpe from "./pages/OnboardingPpe";
import OnboardingEthics from "./pages/OnboardingEthics";
import OnboardingIndex from "./pages/OnboardingIndex";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModuleProgressProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingIndex />} />
            <Route path="/onboarding/intro" element={<OnboardingIntro />} />
            <Route path="/onboarding/protocoles" element={<OnboardingProtocols />} />
            <Route path="/onboarding/simulations" element={<OnboardingSimulations />} />
            <Route path="/onboarding/conflits" element={<OnboardingConflicts />} />
            <Route path="/onboarding/incendie" element={<OnboardingFire />} />
            <Route path="/onboarding/epi" element={<OnboardingPpe />} />
            <Route path="/onboarding/ethique" element={<OnboardingEthics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ModuleProgressProvider>
  </QueryClientProvider>
);

export default App;
