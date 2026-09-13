import { FileText, SearchX } from "lucide-react";
import type { Notebook } from "../../types/notebook";
import { NoteCard } from "./NoteCard";

type NoteListProps = {
  notes: Notebook[];
  isIndexingNoteId: string | null;
  onIndex: (noteId: string) => void;
  onCreateNote: () => void;
};

export function NoteList({
  notes,
  isIndexingNoteId,
  onIndex,
  onCreateNote,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <section className="notes-empty-state">
        <div className="notes-empty-state__icon">
          <FileText size={28} />
        </div>

        <h3>No notes found</h3>

        <p>
          Create your first note to save important concepts, study reflections,
          and ideas in your learning workspace.
        </p>

        <button
          className="notes-empty-state__button"
          type="button"
          onClick={onCreateNote}
        >
          Create your first note
        </button>
      </section>
    );
  }

  return (
    <section className="note-list" aria-label="Notebook notes">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          isIndexing={isIndexingNoteId === note.id}
          onIndex={onIndex}
        />
      ))}
    </section>
  );
}

type NotesNoSearchResultsProps = {
  searchTerm: string;
  onClearSearch: () => void;
};

export function NotesNoSearchResults({
  searchTerm,
  onClearSearch,
}: NotesNoSearchResultsProps) {
  return (
    <section className="notes-empty-state">
      <div className="notes-empty-state__icon">
        <SearchX size={28} />
      </div>

      <h3>No matching notes</h3>

      <p>
        No notes match “{searchTerm}”. Try a different word or clear the
        filter.
      </p>

      <button
        className="notes-empty-state__button"
        type="button"
        onClick={onClearSearch}
      >
        Clear filter
      </button>
    </section>
  );
}