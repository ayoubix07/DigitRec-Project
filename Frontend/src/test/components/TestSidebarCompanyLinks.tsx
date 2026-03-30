import { BriefcaseBusiness, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { companyWorkspaceLinks } from "../lib/testWorkspace";

type TestSidebarCompanyLinksProps = {
  collapsed: boolean;
};

const iconByPath: Record<string, typeof BriefcaseBusiness> = {
  "/test/offers": BriefcaseBusiness,
  "/test/candidates": Users,
};

const TestSidebarCompanyLinks = ({ collapsed }: TestSidebarCompanyLinksProps) => {
  return (
    <>
      {companyWorkspaceLinks.map((link) => {
        const Icon = iconByPath[link.to] || BriefcaseBusiness;

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

export default TestSidebarCompanyLinks;
