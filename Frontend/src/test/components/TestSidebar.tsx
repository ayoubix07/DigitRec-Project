import { useTestAccount } from "../hooks/useTestAccount";
import TestSidebarCandidateLinks from "./TestSidebarCandidateLinks";
import TestSidebarCompanyLinks from "./TestSidebarCompanyLinks";
import TestSidebarSharedLinks from "./TestSidebarSharedLinks";

type TestSidebarProps = {
  collapsed: boolean;
};

function buildInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const TestSidebar = ({ collapsed }: TestSidebarProps) => {
  const { account } = useTestAccount();
  const name = account?.displayName || "Compte DigitRec";
  const role =
    account?.accountType === "candidate"
      ? "Candidat"
      : account?.accountType === "company"
        ? "Entreprise"
        : "Compte";
  const initials = buildInitials(name) || "DR";

  return (
    <aside className={collapsed ? "legacy-sidebar legacy-sidebar--collapsed" : "legacy-sidebar"}>
      <div className="legacy-sidebar__brand">
        <div className="legacy-sidebar__logo">{initials}</div>
        {!collapsed ? (
          <div>
            <div className="legacy-sidebar__title">{name}</div>
            <div className="legacy-sidebar__subtitle">{role}</div>
          </div>
        ) : null}
      </div>

      <nav className="legacy-sidebar__nav">
        <TestSidebarSharedLinks collapsed={collapsed} />
        {account?.accountType === "candidate" ? (
          <TestSidebarCandidateLinks collapsed={collapsed} />
        ) : null}
        {account?.accountType === "company" ? (
          <TestSidebarCompanyLinks collapsed={collapsed} />
        ) : null}
      </nav>
    </aside>
  );
};

export default TestSidebar;
