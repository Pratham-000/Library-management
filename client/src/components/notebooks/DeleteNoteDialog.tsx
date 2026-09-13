import { Trash2, X } from "lucide-react";
import { Button } from "../ui/Button";

type DeleteNoteDialogProps = {
  isOpen: boolean;
  notePreview: string;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function getPreview(content: string) {
  const normalizedContent = content.trim();

  if (normalizedContent.length <= 115) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, 115).trim()}…`;
}

export function DeleteNoteDialog({
  isOpen,
  notePreview,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteNoteDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="delete-note-dialog-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        className="delete-note-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-note-title"
      >
        <button
          className="delete-note-dialog__close"
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close delete confirmation"
        >
          <X size={20} />
        </button>

        <div className="delete-note-dialog__icon">
          <Trash2 size={23} />
        </div>

        <h2 id="delete-note-title">Delete this note?</h2>

        <p>
          This will permanently delete “{getPreview(notePreview)}”. This action
          cannot be undone.
        </p>

        {error ? (
          <p className="delete-note-dialog__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="delete-note-dialog__actions">
          <Button
            type="button"
            variant="secondary"
            disabled={isDeleting}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={() => void onConfirm()}
          >
            Delete Note
          </Button>
        </div>
      </section>
    </div>
  );
}