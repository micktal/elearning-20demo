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
import OnboardingDashboard from "./pages/OnboardingDashboard";
import OnboardingIndex from "./pages/OnboardingIndex";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModuleProgressProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Scroll to top on every route change to ensure pages render from the top */}
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingIndex />} />
            <Route path="/onboarding/intro" element={<OnboardingIntro />} />
            <Route path="/onboarding/protocoles" element={<OnboardingProtocols />} />
            <Route path="/onboarding/protocoles/scenario" element={<OnboardingSimulations />} />
            <Route path="/onboarding/simulations" element={<OnboardingSimulations />} />
            <Route path="/onboarding/conflits" element={<OnboardingConflicts />} />
            <Route path="/onboarding/conflits/scenario-1" element={<OnboardingSimulations />} />
            <Route path="/onboarding/incendie" element={<OnboardingFire />} />
            <Route path="/onboarding/incendie/alerte" element={<OnboardingSimulations />} />
            <Route path="/onboarding/epi" element={<OnboardingPpe />} />
            <Route path="/onboarding/epi/scenario" element={<OnboardingSimulations />} />
            <Route path="/onboarding/ethique" element={<OnboardingEthics />} />
            <Route path="/onboarding/ethique/scenario-cadeau" element={<OnboardingSimulations />} />
            <Route path="/onboarding/dashboard" element={<OnboardingDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ModuleProgressProvider>
  </QueryClientProvider>
);

export default App;
