import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "./components/DashboardLayout";
import LoadingBarProvider from "./components/LoadingBarProvider";
import RequireAuth from "./components/RequireAuth";
import Applications from "./pages/Applications";
import Candidates from "./pages/Candidates";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Offers from "./pages/Offers";
import OralTests from "./pages/OralTests";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import WrittenTests from "./pages/WrittenTests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LoadingBarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="offers" element={<Offers />} />
              <Route path="applications" element={<Applications />} />
              <Route path="written-tests" element={<WrittenTests />} />
              <Route path="oral-tests" element={<OralTests />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="settings" element={<Navigate to="/dashboard/profile" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LoadingBarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
