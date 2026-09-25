import {
  BrainCircuit,
  ChevronDown,
  Plus,
  SquarePen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/resources": "Resources",
  "/resources/new": "Create Resource",
  "/notebooks": "Notebooks",
  "/sessions": "Study Sessions",
  "/ai-search": "AI Search",
  "/settings": "Profile & Settings",
};

function getPageTitle(pathname: string) {
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  if (pathname.startsWith("/resources/")) {
    return "Resource";
  }

  if (pathname.startsWith("/notebooks/")) {
    return "Notebook";
  }

  if (pathname.startsWith("/sessions/")) {
    return "Study Session";
  }

  return "Online Library";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const pageTitle = getPageTitle(pathname);
  const initials = user ? getInitials(user.name) : "OL";

  return (
    <header className="topbar">
      <h1 className="topbar__title">{pageTitle}</h1>

      <div className="topbar__actions">
        <Link className="topbar__ai-search" to="/ai-search">
          <BrainCircuit size={18} />
          <span>AI Search</span>
        </Link>

        <Link className="topbar__quick-action" to="/resources/new">
          <Plus size={18} />
          <span className="topbar__quick-action-label">
            Create Resource
          </span>
        </Link>

        <Link className="topbar__new-note" to="/notebooks">
          <SquarePen size={18} />
          <span>New Note</span>
        </Link>

        <button
          className="topbar__avatar"
          type="button"
          aria-label="Open account menu"
          title={user?.name ?? "User"}
          onClick={() => window.location.assign("/settings")}
        >
          <span>{initials}</span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  );
}