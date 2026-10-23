import { Loader2 } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Delete",
  busyLabel = "Deleting...",
  isPending,
  error,
  onConfirm,
  onClose,
}: {
  title: string;
  description?: string;
  confirmLabel?: string;
  busyLabel?: string;
  isPending: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} description={description} onClose={onClose} busy={isPending}>
      {error && (
        <p role="alert" className="mb-4 text-sm text-[var(--like)]">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={isPending} className="btn-ghost">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={isPending} className="btn-danger">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {busyLabel}
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </Modal>
  );
}
