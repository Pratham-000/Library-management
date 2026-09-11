import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="ui-field" htmlFor={inputId}>
      <span className="ui-field__label">{label}</span>

      <input
        id={inputId}
        className={[
          "ui-input",
          error ? "ui-input--error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />

      {error ? (
        <span id={`${inputId}-error`} className="ui-field__error">
          {error}
        </span>
      ) : null}
    </label>
  );
}