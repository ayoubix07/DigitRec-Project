import { LayoutDashboard, Layers3, PanelRightOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

type TestSidebarProps = {
  collapsed: boolean;
};

const links = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/test/dashboard" },
  { icon: Layers3, label: "Page", to: "/test/page" },
  { icon: PanelRightOpen, label: "Page 2", to: "/test/page2" },
];

const TestSidebar = ({ collapsed }: TestSidebarProps) => {
  return (
    <aside className={collapsed ? "legacy-sidebar legacy-sidebar--collapsed" : "legacy-sidebar"}>
      <div className="legacy-sidebar__brand">
        <div className="legacy-sidebar__logo">DR</div>
        {!collapsed ? (
          <div>
            <div className="legacy-sidebar__title">DigitRec</div>
            <div className="legacy-sidebar__subtitle">Workspace</div>
          </div>
        ) : null}
      </div>

      <nav className="legacy-sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "legacy-sidebar__link legacy-sidebar__link--active" : "legacy-sidebar__link"
            }
          >
            <span className="legacy-sidebar__link-icon">
              <link.icon size={18} />
            </span>
            {!collapsed ? <span>{link.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default TestSidebar;
