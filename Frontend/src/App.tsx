import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Offers from "./pages/Offers";
import NewOffer from "./pages/NewOffer";
import Candidates from "./pages/Candidates";
import SettingsPage from "./pages/Settings";
import TestEntryRedirect from "./test/pages/TestEntryRedirect";
import TestLogin from "./test/pages/TestLogin";
import TestRegister from "./test/pages/TestRegister";
import TestDashboard from "./test/pages/TestDashboard";
import TestProfile from "./test/pages/TestProfile";
import TestOffersPage from "./test/pages/TestOffersPage";
import TestApplicationsPage from "./test/pages/TestApplicationsPage";
import TestWrittenTestsPage from "./test/pages/TestWrittenTestsPage";
import TestOralTestsPage from "./test/pages/TestOralTestsPage";
import TestCandidatesPage from "./test/pages/TestCandidatesPage";
import TestNotFound from "./test/pages/TestNotFound";
import TestRequireAuth from "./test/components/TestRequireAuth";
import TestMainAppLayout from "./test/components/TestMainAppLayout";
import TestLoadingBarProvider from "./test/components/TestLoadingBarProvider";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const entrepriseId = localStorage.getItem("entreprise_id");
  if (!token || !entrepriseId) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

const TestNamespaceLayout = () => (
  <TestLoadingBarProvider>
    <Outlet />
  </TestLoadingBarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<TestNamespaceLayout />}>
            <Route index element={<TestEntryRedirect />} />
            <Route path="login" element={<TestLogin />} />
            <Route path="register" element={<TestRegister />} />
            <Route
              element={
                <TestRequireAuth>
                  <TestMainAppLayout />
                </TestRequireAuth>
              }
            >
              <Route path="dashboard" element={<TestDashboard />} />
              <Route path="profile" element={<TestProfile />} />
              <Route path="offers" element={<TestOffersPage />} />
              <Route path="applications" element={<TestApplicationsPage />} />
              <Route path="written-tests" element={<TestWrittenTestsPage />} />
              <Route path="oral-tests" element={<TestOralTestsPage />} />
              <Route path="candidates" element={<TestCandidatesPage />} />
            </Route>
            <Route path="*" element={<TestNotFound />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="offers" element={<Offers />} />
            <Route path="offers/new" element={<NewOffer />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
