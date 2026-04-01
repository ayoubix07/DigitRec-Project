import {
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  Mic2,
  ScrollText,
  UserRound,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAccount } from "../hooks/useAccount";
import {
  candidateWorkspaceLinks,
  companyWorkspaceLinks,
  sharedWorkspaceLinks,
  WorkspaceNavItem,
} from "../lib/workspace";

type AppSidebarProps = {
  collapsed: boolean;
};

const iconByPath: Record<string, typeof LayoutDashboard> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/profile": UserRound,
  "/dashboard/offers": BriefcaseBusiness,
  "/dashboard/applications": ClipboardList,
  "/dashboard/written-tests": ScrollText,
  "/dashboard/oral-tests": Mic2,
  "/dashboard/candidates": Users,
};

function buildInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function SidebarLink({ collapsed, link }: { collapsed: boolean; link: WorkspaceNavItem }) {
  const Icon = iconByPath[link.to] || LayoutDashboard;

  return (
    <NavLink
      to={link.to}
      end={link.to === "/dashboard"}
      className={({ isActive }) =>
        isActive ? "legacy-sidebar__link legacy-sidebar__link--active" : "legacy-sidebar__link"
      }
    >
      <span className="legacy-sidebar__link-icon">
        <Icon size={18} />
      </span>
      {!collapsed ? <span>{link.label}</span> : null}
    </NavLink>
  );
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const { account } = useAccount();
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
        {sharedWorkspaceLinks.map((link) => (
          <SidebarLink key={link.to} collapsed={collapsed} link={link} />
        ))}
        {account?.accountType === "candidate"
          ? candidateWorkspaceLinks.map((link) => (
              <SidebarLink key={link.to} collapsed={collapsed} link={link} />
            ))
          : null}
        {account?.accountType === "company"
          ? companyWorkspaceLinks.map((link) => (
              <SidebarLink key={link.to} collapsed={collapsed} link={link} />
            ))
          : null}
      </nav>
    </aside>
  );
}
