import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LibraryBig,
  Timer,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const mobileItems = [
  {
    label: "Home",
    to: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Notes",
    to: "/notebooks",
    icon: FileText,
  },
  {
    label: "Search",
    to: "/ai-search",
    icon: BrainCircuit,
  },
  {
    label: "Sessions",
    to: "/sessions",
    icon: Timer,
  },
  {
    label: "Resources",
    to: "/resources/new",
    icon: LibraryBig,
  },
];

export function MobileNavigation() {
  return (
    <nav className="mobile-navigation" aria-label="Mobile navigation">
      {mobileItems.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              "mobile-navigation__item",
              isActive ? "mobile-navigation__item--active" : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}