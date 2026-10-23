import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Couldn't load this",
  message = "Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="surface card flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--like)]/10 text-[var(--like)]">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-6">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
