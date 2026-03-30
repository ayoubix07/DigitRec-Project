import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const isTokenValid = (token: string | null) => {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && typeof payload.exp === "number") {
      return Date.now() / 1000 < payload.exp;
    }
  } catch {
    return false;
  }
  return true;
};

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isTokenValid(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("entreprise");
      navigate("/", { replace: true });
    }
    window.onpageshow = (event) => {
      if (event.persisted) {
        const sessionToken = localStorage.getItem("token");
        if (!isTokenValid(sessionToken)) {
          navigate("/", { replace: true });
        }
      }
    };
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold text-foreground">DigitRec</h1>
          </header>
          <main className="flex-1 overflow-auto bg-background p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
