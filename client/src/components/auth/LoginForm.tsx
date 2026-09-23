import { BookOpen, CheckCircle2, Chrome, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function LoginForm() {
  const { login } = useAuth();

  return (
    <div className="auth-card">
      <div className="auth-card__brand">
        <span className="auth-card__logo" aria-hidden="true">
          <BookOpen size={22} strokeWidth={2} />
        </span>
        <span>Online Library</span>
      </div>

      <div className="auth-card__heading">
        <span className="auth-card__eyebrow">
          <Sparkles size={15} />
          Study smarter
        </span>
        <h1>Welcome back.</h1>
        <p>Keep your notes, resources and study sessions in one focused workspace.</p>
      </div>

      <div className="auth-card__highlights">
        <span><CheckCircle2 size={16} /> Personal study workspace</span>
        <span><CheckCircle2 size={16} /> AI-powered resource search</span>
        <span><CheckCircle2 size={16} /> Secure Google sign-in</span>
      </div>

      <Button type="button" fullWidth onClick={() => void login()}>
        <Chrome size={18} />
        Continue with Google
      </Button>

      <div className="auth-card__security">
        <ShieldCheck size={17} />
        <span>Authentication is handled securely by Auth0.</span>
      </div>

      <p className="auth-card__footer">
        By continuing, you agree to use this library only for legitimate study and educational purposes.
      </p>
    </div>
  );
}