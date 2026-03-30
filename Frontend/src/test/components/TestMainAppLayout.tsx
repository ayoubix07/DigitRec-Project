import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TestSidebar from "./TestSidebar";
import TestTopbar from "./TestTopbar";
import "../styles/test-shell.css";

const TestMainAppLayout = () => {
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
      <TestSidebar collapsed={effectiveCollapsed} />
      <div
        className={
          effectiveCollapsed
            ? "legacy-shell__content legacy-shell__content--expanded"
            : "legacy-shell__content"
        }
      >
        <TestTopbar
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

export default TestMainAppLayout;
