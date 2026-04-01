import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
import "../styles/shell.css";
import "../styles/workspace.css";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const syncCompact = () => {
      setCompact(window.innerWidth <= 980);
    };

    syncCompact();
    window.addEventListener("resize", syncCompact);

    return () => {
      window.removeEventListener("resize", syncCompact);
    };
  }, []);

  const effectiveCollapsed = compact || collapsed;

  return (
    <div className="legacy-shell">
      <AppSidebar collapsed={effectiveCollapsed} />
      <div
        className={
          effectiveCollapsed
            ? "legacy-shell__content legacy-shell__content--expanded"
            : "legacy-shell__content"
        }
      >
        <Topbar
          collapsed={effectiveCollapsed}
          onToggleSidebar={() => {
            if (!compact) {
              setCollapsed((value) => !value);
            }
          }}
        />
        <main className="legacy-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
