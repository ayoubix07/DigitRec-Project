import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import MainRequireAuth from "./components/MainRequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <MainRequireAuth>
                <DashboardLayout />
              </MainRequireAuth>
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
