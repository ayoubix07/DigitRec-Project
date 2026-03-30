import { Menu, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, resolveCurrentProfile, signOut } from "../services/testAuthService";

type TopbarState = {
  email: string;
  initials: string;
  name: string;
  role: string;
};

type TestTopbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
};

function buildInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const TestTopbar = ({ collapsed, onToggleSidebar }: TestTopbarProps) => {
  const navigate = useNavigate();
  const [meta, setMeta] = useState<TopbarState>({
    email: "",
    initials: "DR",
    name: "DigitRec User",
    role: "Unknown",
  });

  useEffect(() => {
    let active = true;

    const loadMeta = async () => {
      const profileResult = await resolveCurrentProfile();

      if (!active) return;

      if (profileResult.data) {
        const name = profileResult.data.displayName;
        setMeta({
          email: profileResult.data.authUser.email || "",
          initials: buildInitials(name) || "DR",
          name,
          role:
            profileResult.data.accountType === "candidate"
              ? "Candidate"
              : profileResult.data.accountType === "company"
                ? "Company"
                : "Unknown",
        });
        return;
      }

      const userResult = await getCurrentUser();

      if (!active || !userResult.data) return;

      const fallbackName = userResult.data.email || "DigitRec User";
      setMeta({
        email: userResult.data.email || "",
        initials: buildInitials(fallbackName) || "DR",
        name: fallbackName,
        role: "Unknown",
      });
    };

    loadMeta();

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/test/login", { replace: true });
  };

  return (
    <header className="legacy-topbar">
      <div className="legacy-topbar__left">
        <button
          type="button"
          className="legacy-topbar__menu"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={!collapsed}
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="legacy-topbar__eyebrow">Account Overview</div>
          <div className="legacy-topbar__title">Dashboard</div>
        </div>
      </div>

      <div className="legacy-topbar__right">
        <div className="legacy-topbar__chip">
          <ShieldCheck size={14} />
          <span>Supabase</span>
        </div>

        <div className="legacy-topbar__user">
          <div className="legacy-topbar__avatar">{meta.initials}</div>
          <div className="legacy-topbar__identity">
            <div className="legacy-topbar__name">{meta.name}</div>
            <div className="legacy-topbar__meta">
              {meta.role}
              {meta.email ? ` · ${meta.email}` : ""}
            </div>
          </div>
        </div>

        <button type="button" className="legacy-topbar__action" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
};

export default TestTopbar;
