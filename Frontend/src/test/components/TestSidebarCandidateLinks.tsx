import { BriefcaseBusiness, ClipboardList, Mic2, ScrollText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { candidateWorkspaceLinks } from "../lib/testWorkspace";

type TestSidebarCandidateLinksProps = {
  collapsed: boolean;
};

const iconByPath: Record<string, typeof BriefcaseBusiness> = {
  "/test/offers": BriefcaseBusiness,
  "/test/applications": ClipboardList,
  "/test/written-tests": ScrollText,
  "/test/oral-tests": Mic2,
};

const TestSidebarCandidateLinks = ({ collapsed }: TestSidebarCandidateLinksProps) => {
  return (
    <>
      {candidateWorkspaceLinks.map((link) => {
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

export default TestSidebarCandidateLinks;
