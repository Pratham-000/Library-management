import { Outlet } from "react-router-dom";
import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-shell__main">
        <Topbar />

        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}