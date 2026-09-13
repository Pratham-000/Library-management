import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

type NoteEditorProps = {
  isOpen: boolean;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
};

export function NoteEditor({
  isOpen,
  isSaving,
  error,
  onClose,
  onSave,
}: NoteEditorProps) {
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setContent("");
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setValidationError("Notebook content cannot be empty.");
      return;
    }

    setValidationError(null);
    await onSave(trimmedContent);
  }

  const visibleError = validationError ?? error;

  return (
    <div
      className="note-editor-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <section
        className="note-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-note-title"
      >
        <div className="note-editor-modal__header">
          <div>
            <h2 id="create-note-title">New Note</h2>
            <p>Capture an idea, study reflection, or important concept.</p>
          </div>

          <button
            className="note-editor-modal__close"
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close new note modal"
          >
            <X size={21} />
          </button>
        </div>

        <form className="note-editor-form" onSubmit={handleSubmit}>
          <label className="note-editor-form__field" htmlFor="note-content">
            <span>Note content</span>

            <textarea
              id="note-content"
              autoFocus
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write what you learned, what you want to remember, or what you need to review..."
              disabled={isSaving}
              rows={10}
            />
          </label>

          {visibleError ? (
            <p className="note-editor-form__error" role="alert">
              {visibleError}
            </p>
          ) : null}

          <div className="note-editor-form__hint">
            You can connect this note to a resource or study session later.
          </div>

          <div className="note-editor-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={isSaving}>
              Save Note
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}