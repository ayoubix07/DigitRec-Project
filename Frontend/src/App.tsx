import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import TestPage from "./test/pages/TestPage";
import TestPage2 from "./test/pages/TestPage2";
import TestNotFound from "./test/pages/TestNotFound";
import TestRequireAuth from "./test/components/TestRequireAuth";
import TestMainAppLayout from "./test/components/TestMainAppLayout";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const entrepriseId = localStorage.getItem("entreprise_id");
  if (!token || !entrepriseId) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<TestEntryRedirect />} />
          <Route path="/test/login" element={<TestLogin />} />
          <Route path="/test/register" element={<TestRegister />} />
          <Route
            path="/test"
            element={
              <TestRequireAuth>
                <TestMainAppLayout />
              </TestRequireAuth>
            }
          >
            <Route path="dashboard" element={<TestDashboard />} />
            <Route path="page" element={<TestPage />} />
            <Route path="page2" element={<TestPage2 />} />
          </Route>
          <Route path="/test/*" element={<TestNotFound />} />
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
