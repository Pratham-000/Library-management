import { useMemo, useState } from "react";
import { ArrowDownAZ, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { NoteEditor } from "../components/notebooks/NoteEditor";
import {
  NoteList,
  NotesNoSearchResults,
} from "../components/notebooks/NoteList";
import { PageHeader } from "../components/layout/PageHeader";
import {
  useCreateNotebook,
  useIndexNotebookWithAI,
} from "../hooks/useNotebookMutations";
import { useNotebooks } from "../hooks/useNotebooks";

function sortByNewestFirst<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort(
    (firstItem, secondItem) =>
      new Date(secondItem.createdAt).getTime() -
      new Date(firstItem.createdAt).getTime(),
  );
}

export function NotebooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [indexingNoteId, setIndexingNoteId] = useState<string | null>(null);
  const [indexMessage, setIndexMessage] = useState<string | null>(null);

  const {
    data: notebooks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useNotebooks();

  const createNotebook = useCreateNotebook();
  const indexNotebook = useIndexNotebookWithAI();

  const sortedNotes = useMemo(
    () => sortByNewestFirst(notebooks),
    [notebooks],
  );

  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return sortedNotes;
    }

    return sortedNotes.filter((note) => {
      const resourceTitle = note.resource?.title.toLowerCase() ?? "";

      return (
        note.content.toLowerCase().includes(normalizedSearch) ||
        resourceTitle.includes(normalizedSearch)
      );
    });
  }, [searchTerm, sortedNotes]);

  async function handleCreateNote(content: string) {
    try {
      setCreateError(null);

      await createNotebook.mutateAsync({
        content,
      });

      setIsCreateModalOpen(false);
    } catch (mutationError) {
      setCreateError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to create the note. Please try again.",
      );
    }
  }

  async function handleIndexNote(noteId: string) {
    try {
      setIndexMessage(null);
      setIndexingNoteId(noteId);

      await indexNotebook.mutateAsync(noteId);

      setIndexMessage(
        "Your note is now searchable with AI semantic search.",
      );
    } catch (mutationError) {
      setIndexMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to index this note with AI. Please try again.",
      );
    } finally {
      setIndexingNoteId(null);
    }
  }

  return (
    <section className="notebooks-page">
      <PageHeader
        title="Notebooks"
        description="Save study notes and make them searchable by meaning with AI."
        actions={
          <div className="notebooks-page__header-actions">
            <Link className="notebooks-page__ai-link" to="/ai-search">
              <Search size={18} />
              <span>AI Search</span>
            </Link>

            <button
              className="notebooks-page__new-note-button"
              type="button"
              onClick={() => {
                setCreateError(null);
                setIsCreateModalOpen(true);
              }}
            >
              <Plus size={18} />
              <span>New Note</span>
            </button>
          </div>
        }
      />

      <div className="notebooks-toolbar">
        <label className="notebooks-search" htmlFor="notebook-search">
          <Search size={19} />

          <input
            id="notebook-search"
            type="search"
            placeholder="Filter notes..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="notebooks-sort">
          <ArrowDownAZ size={17} />
          <span>Newest first</span>
        </div>
      </div>

      {indexMessage ? (
        <div
          className={[
            "notebooks-feedback",
            indexMessage.includes("searchable")
              ? "notebooks-feedback--success"
              : "notebooks-feedback--error",
          ].join(" ")}
          role="status"
        >
          {indexMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="note-list">
          <div className="note-card note-card--skeleton" />
          <div className="note-card note-card--skeleton" />
          <div className="note-card note-card--skeleton" />
        </div>
      ) : null}

      {isError ? (
        <section className="notes-empty-state">
          <div className="notes-empty-state__icon">!</div>

          <h3>Could not load notes</h3>

          <p>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading your notebook."}
          </p>

          <button
            className="notes-empty-state__button"
            type="button"
            onClick={() => void refetch()}
          >
            Try again
          </button>
        </section>
      ) : null}

      {!isLoading && !isError && searchTerm && filteredNotes.length === 0 ? (
        <NotesNoSearchResults
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      ) : null}

      {!isLoading && !isError && (!searchTerm || filteredNotes.length > 0) ? (
        <NoteList
          notes={filteredNotes}
          isIndexingNoteId={indexingNoteId}
          onIndex={(noteId) => void handleIndexNote(noteId)}
          onCreateNote={() => {
            setCreateError(null);
            setIsCreateModalOpen(true);
          }}
        />
      ) : null}

      <NoteEditor
        isOpen={isCreateModalOpen}
        isSaving={createNotebook.isPending}
        error={createError}
        onClose={() => {
          if (!createNotebook.isPending) {
            setIsCreateModalOpen(false);
            setCreateError(null);
          }
        }}
        onSave={handleCreateNote}
      />
    </section>
  );
}