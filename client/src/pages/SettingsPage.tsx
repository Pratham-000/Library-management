import { useEffect, useState } from "react";
import { Check, Mail, Moon, Save, Sun, UserRound, Monitor } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme, type ThemePreference } from "../context/ThemeContext";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", description: "Bright and clean", icon: Sun },
  { value: "dark", label: "Dark", description: "Easy on the eyes", icon: Moon },
  { value: "system", label: "System", description: "Follow your device", icon: Monitor },
];

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setMessage("Please enter a name with at least 2 characters.");
      return;
    }

    if (trimmedName.length > 80) {
      setMessage("Name must be 80 characters or fewer.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateUser({ name: trimmedName });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="settings-page">
      <header className="page-header settings-page__header">
        <div>
          <p className="settings-page__eyebrow">Account</p>
          <h2>Profile & Settings</h2>
          <p className="page-header__description">
            Manage your profile information and personalize your library experience.
          </p>
        </div>
      </header>

      <div className="settings-page__layout">
        <div className="settings-profile-card">
          <div className="settings-profile-card__avatar">{getInitials(user?.name ?? "Student")}</div>
          <div>
            <h3>{user?.name ?? "Student"}</h3>
            <p>{user?.email ?? "No email available"}</p>
            <span>{user?.role ?? "STUDENT"}</span>
          </div>
        </div>

        <form className="settings-card" onSubmit={handleSave}>
          <div className="settings-card__heading">
            <div className="settings-card__icon"><UserRound size={19} /></div>
            <div>
              <h3>Profile information</h3>
              <p>Update the name shown throughout your library.</p>
            </div>
          </div>

          <label className="settings-field">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              maxLength={80}
              autoComplete="name"
            />
          </label>

          <label className="settings-field">
            <span>Email</span>
            <div className="settings-field__readonly">
              <Mail size={17} />
              <input value={user?.email ?? ""} readOnly />
            </div>
            <small>Your email is managed by Google/Auth0 and cannot be changed here.</small>
          </label>

          <div className="settings-form__footer">
            {message && (
              <p className={message.includes("successfully") ? "settings-message settings-message--success" : "settings-message"}>
                {message.includes("successfully") && <Check size={16} />}
                {message}
              </p>
            )}
            <button className="settings-save-button" type="submit" disabled={saving}>
              <Save size={17} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        <div className="settings-card">
          <div className="settings-card__heading">
            <div className="settings-card__icon"><Moon size={19} /></div>
            <div>
              <h3>Appearance</h3>
              <p>Choose how Online Library looks on your device.</p>
            </div>
          </div>

          <div className="settings-theme-options">
            {themeOptions.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={`settings-theme-option ${theme === value ? "settings-theme-option--active" : ""}`}
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
              >
                <span className="settings-theme-option__icon"><Icon size={18} /></span>
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                {theme === value && <Check size={17} />}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-card settings-card--account">
          <div className="settings-card__heading">
            <div className="settings-card__icon"><Mail size={19} /></div>
            <div>
              <h3>Account & security</h3>
              <p>Your authentication is securely handled by Auth0.</p>
            </div>
          </div>
          <div className="settings-info-row">
            <span>Authentication</span>
            <strong>Google / Auth0</strong>
          </div>
          <div className="settings-info-row">
            <span>Account role</span>
            <strong>{user?.role ?? "STUDENT"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
