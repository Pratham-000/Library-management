import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Enter both your email address and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await loginUser({
        email: email.trim(),
        password,
      });

      login(result.token, result.user);
      onSuccess();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__brand">
        <div className="login-form__logo" aria-hidden="true">
          <Sparkles size={22} strokeWidth={2.2} />
        </div>

        <span>Online Library</span>
      </div>

      <div className="login-form__heading">
        <h1>Welcome back</h1>
        <p>Sign in to continue to your study workspace</p>
      </div>

      {formError ? (
        <div className="login-form__error" role="alert">
          {formError}
        </div>
      ) : null}

      <div className="login-form__fields">
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
        />

        <div className="login-password-field">
          <Input
            label="Password"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />

          <button
            className="login-password-field__toggle"
            type="button"
            onClick={() => setShowPassword((currentValue) => !currentValue)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <p className="login-form__helper">
        Password reset is not available.
      </p>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Log in
      </Button>

      <p className="login-form__footer">
        Registration is currently invite-only. Contact your administrator for
        access.
      </p>
    </form>
  );
}