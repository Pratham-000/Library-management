import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  FileWarning,
  LoaderCircle,
  Save,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteNoteDialog } from "../components/notebooks/DeleteNoteDialog";
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
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [indexMessage, setIndexMessage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

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

  const hasUnsavedChanges =
    content.trim() !== currentNote.content.trim();

  async function handleSave() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setSaveError("Notebook content cannot be empty.");
      setSaveMessage(null);
      return;
    }

    try {
      setSaveError(null);
      setSaveMessage(null);

      await updateNotebook.mutateAsync({
        content: trimmedContent,
      });

      setSaveMessage("Changes saved successfully.");
    } catch (mutationError) {
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

      setIndexMessage(
        "This note is now searchable with AI semantic search.",
      );
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

      navigate("/notebooks", {
        replace: true,
      });
    } catch (mutationError) {
      setDeleteError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to delete this note. Please try again.",
      );
    }
  }

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

        <button
          className="note-detail-page__save-button"
          type="button"
          onClick={() => void handleSave()}
          disabled={
            !hasUnsavedChanges ||
            updateNotebook.isPending ||
            indexNotebook.isPending
          }
        >
          {updateNotebook.isPending ? (
            <LoaderCircle className="spin-icon" size={18} />
          ) : (
            <Save size={18} />
          )}

          <span>{updateNotebook.isPending ? "Saving..." : "Save"}</span>
        </button>
      </header>

      <div className="note-detail-page__layout">
        <main className="note-detail-editor">
          <textarea
            className="note-detail-editor__textarea"
            aria-label="Notebook content"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setSaveMessage(null);
              setSaveError(null);
            }}
            disabled={updateNotebook.isPending}
          />

          <div className="note-detail-editor__footer">
            <div>
              {saveError ? (
                <p className="note-detail-editor__error" role="alert">
                  {saveError}
                </p>
              ) : null}

              {saveMessage ? (
                <p className="note-detail-editor__success" role="status">
                  <Check size={16} />
                  {saveMessage}
                </p>
              ) : null}
            </div>

            <span>
              Created {formatDate(currentNote.createdAt)}
              {hasUnsavedChanges ? " · Unsaved changes" : ""}
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