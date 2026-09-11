import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "ui-button",
        `ui-button--${variant}`,
        fullWidth ? "ui-button--full-width" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="ui-button__spinner" /> : null}
      <span>{isLoading ? "Please wait..." : children}</span>
    </button>
  );
}