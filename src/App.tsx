import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppShell from "@/components/AppShell";
import HomePage from "./pages/HomePage";
import TrackPage from "./pages/TrackPage";
import SyncPage from "./pages/SyncPage";
import LearnPage from "./pages/LearnPage";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import CarePage from "./pages/CarePage";
import WombCarePage from "./pages/WombCarePage";
import FriendsPage from "./pages/FriendsPage";

const queryClient = new QueryClient();

const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, onboardingCompleted } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (user && onboardingCompleted === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route
                path="/*"
                element={
                  <OnboardingGate>
                    <AppShell>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/track" element={<TrackPage />} />
                        <Route path="/sync" element={<SyncPage />} />
                        <Route path="/learn" element={<LearnPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/care" element={<CarePage />} />
                        <Route path="/womb-care" element={<WombCarePage />} />
                        <Route path="/friends" element={<FriendsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppShell>
                  </OnboardingGate>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
