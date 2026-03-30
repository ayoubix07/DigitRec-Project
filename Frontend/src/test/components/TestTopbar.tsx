import { Menu } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTestAccount } from "../hooks/useTestAccount";
import { getPageMeta } from "../lib/testWorkspace";
import { signOut } from "../services/testAuthService";
import { useTestLoadingBar } from "./TestLoadingBarProvider";

type TestTopbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
};

const TestTopbar = ({ collapsed, onToggleSidebar }: TestTopbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account } = useTestAccount();
  const { startLoading } = useTestLoadingBar();
  const pageMeta = useMemo(
    () => getPageMeta(location.pathname, account?.accountType || "unknown"),
    [account?.accountType, location.pathname]
  );

  const handleSignOut = async () => {
    const stopLoading = startLoading();

    try {
      await signOut();
      navigate("/test/login", { replace: true });
    } finally {
      stopLoading();
    }
  };

  return (
    <header className="legacy-topbar">
      <div className="legacy-topbar__left">
        <button
          type="button"
          className="legacy-topbar__menu"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Ouvrir la barre latérale" : "Réduire la barre latérale"}
          aria-pressed={!collapsed}
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="legacy-topbar__eyebrow">{pageMeta.eyebrow}</div>
          <div className="legacy-topbar__title">{pageMeta.title}</div>
        </div>
      </div>

      <div className="legacy-topbar__right">
        <button type="button" className="legacy-topbar__action" onClick={handleSignOut}>
          Se déconnecter
        </button>
      </div>
    </header>
  );
};

export default TestTopbar;
