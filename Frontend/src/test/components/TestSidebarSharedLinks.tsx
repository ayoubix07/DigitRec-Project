import { LayoutDashboard, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { sharedWorkspaceLinks } from "../lib/testWorkspace";

type TestSidebarSharedLinksProps = {
  collapsed: boolean;
};

const iconByPath: Record<string, typeof LayoutDashboard> = {
  "/test/dashboard": LayoutDashboard,
  "/test/profile": UserRound,
};

const TestSidebarSharedLinks = ({ collapsed }: TestSidebarSharedLinksProps) => {
  return (
    <>
      {sharedWorkspaceLinks.map((link) => {
        const Icon = iconByPath[link.to] || LayoutDashboard;

        return (
          <NavLink
            key={link.to}
            to={link.to}
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
      })}
    </>
  );
};

export default TestSidebarSharedLinks;
