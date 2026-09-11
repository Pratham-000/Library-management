import { LoginForm } from "../components/auth/LoginForm";

type LoginPageProps = {
  onLoginSuccess: () => void;
};

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--left" />
      <div className="login-page__glow login-page__glow--right" />

      <section className="login-page__card">
        <LoginForm onSuccess={onLoginSuccess} />
      </section>
    </main>
  );
}