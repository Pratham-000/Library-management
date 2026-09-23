import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Moon,
  Sparkles,
  Timer,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Resources",
    to: "/resources",
    icon: LibraryBig,
  },
  {
    label: "Notebooks",
    to: "/notebooks",
    icon: FileText,
  },
  {
    label: "Study Sessions",
    to: "/sessions",
    icon: Timer,
  },
  {
    label: "AI Search",
    to: "/ai-search",
    icon: BrainCircuit,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar() {
  const { user, logout } = useAuth();

  const initials = user ? getInitials(user.name) : "OL";

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <NavLink className="sidebar__brand" to="/">
          <span className="sidebar__logo">
            <Sparkles size={22} strokeWidth={2.2} />
          </span>

          <span>Online Library</span>
        </NavLink>

        <nav className="sidebar__navigation" aria-label="Primary navigation">
          {navigationItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "sidebar__nav-item",
                  isActive ? "sidebar__nav-item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <Icon size={20} strokeWidth={1.9} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__divider" />

        <div className="sidebar__profile">
          <div className="sidebar__avatar">{initials}</div>

          <div className="sidebar__profile-copy">
            <strong>{user?.name ?? "Student"}</strong>
            <span>{user?.email ?? "student@example.com"}</span>
          </div>
        </div>

        <div className="sidebar__secondary-actions">
          <button
            className="sidebar__secondary-button"
            type="button"
            disabled
            title="Dark theme is currently the default application theme"
          >
            <Moon size={18} />
            <span>Dark theme</span>
          </button>

          <button
            className="sidebar__secondary-button"
            type="button"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}