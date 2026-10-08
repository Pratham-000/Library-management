import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Cloud,
  FileWarning,
  LoaderCircle,
  Save,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteNoteDialog } from "../components/notebooks/DeleteNoteDialog";
import { RichNotebookEditor } from "../components/notebooks/RichNotebookEditor";
import {
  parseNotebookContent,
  serializeNotebookDocument,
  type NotebookDocument,
} from "../types/notebookDocument";
import { NoteDetailsPanel } from "../components/notebooks/NoteDetailsPanel";
import {
  useDeleteNotebook,
  useIndexNotebookWithAI,
  useUpdateNotebook,
} from "../hooks/useNotebookMutations";
import { useNotebook } from "../hooks/useNotebooks";

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type SaveState = "idle" | "unsaved" | "saving" | "saved" | "error";

export function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useNotebook(id);

  const updateNotebook = useUpdateNotebook(id ?? "");
  const deleteNotebook = useDeleteNotebook();
  const indexNotebook = useIndexNotebookWithAI();

  const [content, setContent] = useState("");
  const documentRef = useRef<NotebookDocument | null>(null);
  const [documentVersion, setDocumentVersion] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [indexMessage, setIndexMessage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!note) return;

    if (documentRef.current === null || content === note.content) {
      setContent(note.content);
      documentRef.current = parseNotebookContent(note.content);
      setDocumentVersion((value) => value + 1);
      setSaveState("idle");
      return;
    }

    // The query cache may update after an autosave. Do not reset the editor
    // while local content is newer than the server snapshot.
    if (note.content === content) {
      setSaveState("saved");
    }
  }, [note, content]);

  useEffect(() => {
    if (!note || !id || isLoading || content === note.content || updateNotebook.isPending) {
      return;
    }

    setSaveState("unsaved");
    const timer = window.setTimeout(() => {
      const nextContent = documentRef.current
        ? serializeNotebookDocument(documentRef.current)
        : content;

      if (!nextContent.trim()) return;

      setSaveState("saving");
      setSaveMessage(null);
      setSaveError(null);

      void updateNotebook.mutateAsync({ content: nextContent })
        .then((updatedNote) => {
          setContent(updatedNote.content);
          documentRef.current = parseNotebookContent(updatedNote.content);
          setSaveState("saved");
          setSaveMessage("Autosaved.");
        })
        .catch((mutationError: unknown) => {
          setSaveState("error");
          setSaveError(
            mutationError instanceof Error
              ? mutationError.message
              : "Autosave failed. Your changes are still on this page.",
          );
        });
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [content, id, isLoading, note, updateNotebook]);

  if (!id) {
    return (
      <section className="note-detail-error-state">
        <FileWarning size={36} />
        <h1>Invalid note address</h1>
        <p>No notebook ID was provided in the URL.</p>
        <Link to="/notebooks">Return to Notebooks</Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="note-detail-loading">
        <LoaderCircle className="spin-icon" size={30} />
        <span>Loading your note...</span>
      </section>
    );
  }

  if (isError || !note) {
    return (
      <section className="note-detail-error-state">
        <FileWarning size={36} />
        <h1>Could not load this note</h1>
        <p>
          {error instanceof Error
            ? error.message
            : "The note may have been deleted or is no longer available."}
        </p>
        <Link to="/notebooks">Return to Notebooks</Link>
      </section>
    );
  }

  const currentNote = note;
  const hasUnsavedChanges = content !== currentNote.content;

  async function handleSave() {
    const nextContent = documentRef.current
      ? serializeNotebookDocument(documentRef.current)
      : content;

    if (!nextContent.trim()) {
      setSaveError("Notebook content cannot be empty.");
      setSaveMessage(null);
      setSaveState("error");
      return;
    }

    try {
      setSaveError(null);
      setSaveMessage(null);
      setSaveState("saving");

      const updatedNote = await updateNotebook.mutateAsync({
        content: nextContent,
      });

      setContent(updatedNote.content);
      documentRef.current = parseNotebookContent(updatedNote.content);
      setSaveState("saved");
      setSaveMessage("Changes saved successfully.");
    } catch (mutationError) {
      setSaveState("error");
      setSaveError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to save this note. Please try again.",
      );
    }
  }

  async function handleIndex() {
    try {
      setIndexMessage(null);
      await indexNotebook.mutateAsync(currentNote.id);
      setIndexMessage("This note is now searchable with AI semantic search.");
    } catch (mutationError) {
      setIndexMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to index this note with AI. Please try again.",
      );
    }
  }

  async function handleDelete() {
    try {
      setDeleteError(null);
      await deleteNotebook.mutateAsync(currentNote.id);
      navigate("/notebooks", { replace: true });
    } catch (mutationError) {
      setDeleteError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to delete this note. Please try again.",
      );
    }
  }

  const statusLabel =
    saveState === "saving"
      ? "Saving..."
      : saveState === "unsaved"
        ? "Unsaved changes"
        : saveState === "error"
          ? "Save failed"
          : "Saved";

  return (
    <section className="note-detail-page">
      <header className="note-detail-page__header">
        <div className="note-detail-page__breadcrumbs">
          <Link to="/notebooks">
            <ArrowLeft size={17} />
            Notebooks
          </Link>
          <span>/</span>
          <strong>Note</strong>
        </div>

        <div className="note-detail-page__save-area">
          <span className={`note-detail-page__save-status note-detail-page__save-status--${saveState}`} role="status">
            {saveState === "saving" ? <LoaderCircle className="spin-icon" size={15} /> : <Cloud size={15} />}
            {statusLabel}
          </span>

          <button
            className="note-detail-page__save-button"
            type="button"
            onClick={() => void handleSave()}
            disabled={!hasUnsavedChanges || updateNotebook.isPending || indexNotebook.isPending}
          >
            {updateNotebook.isPending ? <LoaderCircle className="spin-icon" size={18} /> : <Save size={18} />}
            <span>{updateNotebook.isPending ? "Saving..." : "Save now"}</span>
          </button>
        </div>
      </header>

      <div className="note-detail-page__layout">
        <main className="note-detail-editor">
          <RichNotebookEditor
            key={documentVersion}
            initialDocument={documentRef.current ?? parseNotebookContent(content)}
            disabled={updateNotebook.isPending}
            onDocumentChange={(nextDocument) => {
              documentRef.current = nextDocument;
              setSaveMessage(null);
              setSaveError(null);
              setSaveState("unsaved");
              setContent(serializeNotebookDocument(nextDocument));
            }}
          />

          <div className="note-detail-editor__footer">
            <div>
              {saveError ? <p className="note-detail-editor__error" role="alert">{saveError}</p> : null}
              {saveMessage ? (
                <p className="note-detail-editor__success" role="status">
                  <Check size={16} />
                  {saveMessage}
                </p>
              ) : null}
            </div>
            <span>
              Created {formatDate(currentNote.createdAt)}
              {hasUnsavedChanges ? " · Autosave is on" : ""}
            </span>
          </div>
        </main>

        <NoteDetailsPanel
          note={currentNote}
          isIndexing={indexNotebook.isPending}
          indexMessage={indexMessage}
          onIndex={() => void handleIndex()}
          onDelete={() => {
            setDeleteError(null);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        notePreview={currentNote.content}
        isDeleting={deleteNotebook.isPending}
        error={deleteError}
        onClose={() => {
          if (!deleteNotebook.isPending) {
            setIsDeleteDialogOpen(false);
            setDeleteError(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </section>
  );
}
