import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { RichNotebookEditor } from "./RichNotebookEditor";
import { parseNotebookContent, serializeNotebookDocument, type NotebookDocument } from "../../types/notebookDocument";

type NoteEditorProps = {
  isOpen: boolean;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
};

export function NoteEditor({ isOpen, isSaving, error, onClose, onSave }: NoteEditorProps) {
  const documentRef = useRef<NotebookDocument>(parseNotebookContent(""));
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      documentRef.current = parseNotebookContent("");
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit() {
    const content = serializeNotebookDocument(documentRef.current);
    if (!documentRef.current.blocks.some((block) => block.content.trim())) {
      setValidationError("Notebook content cannot be empty.");
      return;
    }
    setValidationError(null);
    await onSave(content);
  }

  const visibleError = validationError ?? error;

  return (
    <div
      className="note-editor-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <section className="note-editor-modal note-editor-modal--notebook" role="dialog" aria-modal="true" aria-labelledby="create-note-title">
        <div className="note-editor-modal__header">
          <div>
            <h2 id="create-note-title">New Notebook</h2>
            <p>Write, organize, highlight, and add code blocks to your study notes.</p>
          </div>
          <button className="note-editor-modal__close" type="button" onClick={onClose} disabled={isSaving} aria-label="Close new note modal">
            <X size={21} />
          </button>
        </div>

        <RichNotebookEditor
          initialDocument={documentRef.current}
          disabled={isSaving}
          onDocumentChange={(nextDocument) => {
            documentRef.current = nextDocument;
          }}
        />

        {visibleError ? <p className="note-editor-form__error" role="alert">{visibleError}</p> : null}

        <div className="note-editor-form__actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button type="button" isLoading={isSaving} onClick={() => void handleSubmit()}>Save Notebook</Button>
        </div>
      </section>
    </div>
  );
}
