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
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import CarePage from "./pages/CarePage";
import WombCarePage from "./pages/WombCarePage";
import FriendsPage from "./pages/FriendsPage";
import LutealPhasePage from "./pages/LutealPhasePage";
import FollicularPhasePage from "./pages/FollicularPhasePage";
import OvulationPhasePage from "./pages/OvulationPhasePage";
import MenstruationPhasePage from "./pages/MenstruationPhasePage";
import EggFreezingPage from "./pages/EggFreezingPage";
import MaternalHealthPage from "./pages/MaternalHealthPage";
import ArticlePage from "./pages/ArticlePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import ReportsPage from "./pages/ReportsPage";
import InsightsPage from "./pages/InsightsPage";
import SavedPlansPage from "./pages/SavedPlansPage";
import RecipesPage from "./pages/RecipesPage";
import FoodSwapsPage from "./pages/FoodSwapsPage";
import AiMealsPage from "./pages/AiMealsPage";
import AiGroceryPage from "./pages/AiGroceryPage";

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
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/legal/privacy" element={<PrivacyPage />} />
              <Route path="/legal/refund" element={<RefundPage />} />
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
                        <Route path="/learn/luteal-phase" element={<LutealPhasePage />} />
                        <Route path="/learn/follicular-phase" element={<FollicularPhasePage />} />
                        <Route path="/learn/ovulation-phase" element={<OvulationPhasePage />} />
                        <Route path="/learn/menstruation-phase" element={<MenstruationPhasePage />} />
                        <Route path="/learn/egg-freezing" element={<EggFreezingPage />} />
                        <Route path="/learn/maternal-health" element={<MaternalHealthPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community/articles/:slug" element={<ArticlePage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/subscription" element={<SubscriptionPage />} />
                        <Route path="/care" element={<CarePage />} />
                        <Route path="/womb-care" element={<WombCarePage />} />
                        <Route path="/friends" element={<FriendsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/plans" element={<SavedPlansPage />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                        <Route path="/food-swaps" element={<FoodSwapsPage />} />
                        <Route path="/ai-meals" element={<AiMealsPage />} />
                        <Route path="/ai-grocery" element={<AiGroceryPage />} />
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
