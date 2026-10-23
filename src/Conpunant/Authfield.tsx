import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
  right?: ReactNode;
  labelRight?: ReactNode;
};

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, icon, error, right, labelRight, id, ...rest }, ref) => (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
        </label>
        {labelRight}
      </div>

      <div className="field" data-invalid={!!error}>
        <span className="field-icon">{icon}</span>
        <input id={id} ref={ref} aria-invalid={!!error} {...rest} />
        {right}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-[var(--like)]">
          {error}
        </p>
      )}
    </div>
  ),
);

AuthField.displayName = "AuthField";
export default AuthField;