import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDashboard, setShowDashboard] = useState(isAuthenticated);

  if (!isAuthenticated || !showDashboard) {
    return <LoginPage onLoginSuccess={() => setShowDashboard(true)} />;
  }

  return (
    <main className="temporary-dashboard">
      <section className="temporary-dashboard__card">
        <p className="temporary-dashboard__eyebrow">Online Library</p>

        <h1>Welcome back, {user?.name ?? "Student"}</h1>

        <p>
          Login is connected to your Express backend. Next, we will build the
          protected dashboard shell with the sidebar shown in your design.
        </p>

        <button
          className="temporary-dashboard__logout"
          type="button"
          onClick={() => {
            logout();
            setShowDashboard(false);
          }}
        >
          Log out
        </button>
      </section>
    </main>
  );
}

export default App;