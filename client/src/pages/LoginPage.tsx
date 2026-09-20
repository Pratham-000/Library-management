import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="auth-loading">
        <div className="auth-loading__spinner" />
        <p>Loading secure sign-in…</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--one" />
      <div className="auth-page__glow auth-page__glow--two" />

      <section className="auth-layout">
        <div className="auth-visual">
          <span className="auth-visual__badge">
            <SparklesIcon />
            Your study command center
          </span>
          <h1>Read less scattered.<br /><em>Learn more intentionally.</em></h1>
          <p>
            One calm place for resources, notes, study sessions and AI-assisted discovery.
          </p>
          <div className="auth-visual__grid">
            <div><strong>01</strong><span>Organize resources</span></div>
            <div><strong>02</strong><span>Capture notes</span></div>
            <div><strong>03</strong><span>Track sessions</span></div>
          </div>
        </div>

        <div className="auth-layout__panel">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

function SparklesIcon() {
  return <span aria-hidden="true">✦</span>;
}