import {
  BookOpen,
  BrainCircuit,
  Clock3,
  LoaderCircle,
} from "lucide-react";
import type { Notebook } from "../../types/notebook";

type NoteDetailsPanelProps = {
  note: Notebook;
  isIndexing: boolean;
  indexMessage: string | null;
  onIndex: () => void;
  onDelete: () => void;
};

function formatDuration(minutes: number | null) {
  if (minutes === null) {
    return "In progress";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function NoteDetailsPanel({
  note,
  isIndexing,
  indexMessage,
  onIndex,
  onDelete,
}: NoteDetailsPanelProps) {
  return (
    <aside className="note-details-panel">
      <h2>Details</h2>

      <section className="note-details-panel__section">
        <div className="note-details-panel__section-heading">
          <span>Linked Resource</span>
        </div>

        {note.resource ? (
          <div className="note-details-panel__linked-card">
            <div className="note-details-panel__linked-icon">
              <BookOpen size={21} />
            </div>

            <div className="note-details-panel__linked-copy">
              <strong>{note.resource.title}</strong>
              <span>{note.resource.type.replaceAll("_", " ")}</span>
            </div>
          </div>
        ) : (
          <p className="note-details-panel__empty">
            No resource linked to this note.
          </p>
        )}
      </section>

      <section className="note-details-panel__section">
        <div className="note-details-panel__section-heading">
          <span>Linked Session</span>
        </div>

        {note.session ? (
          <div className="note-details-panel__linked-card">
            <div className="note-details-panel__linked-icon">
              <Clock3 size={21} />
            </div>

            <div className="note-details-panel__linked-copy">
              <strong>Study Session</strong>
              <span>
                {note.session.status} ·{" "}
                {formatDuration(note.session.durationMinutes)}
              </span>
            </div>
          </div>
        ) : (
          <p className="note-details-panel__empty">
            No study session linked to this note.
          </p>
        )}
      </section>

      <section className="note-details-panel__section">
        <div className="note-details-panel__section-heading">
          <span>AI Indexing</span>
        </div>

        <p className="note-details-panel__ai-description">
          Make this note available in AI semantic search.
        </p>

        <button
          className="note-details-panel__index-button"
          type="button"
          onClick={onIndex}
          disabled={isIndexing}
        >
          {isIndexing ? (
            <LoaderCircle className="spin-icon" size={18} />
          ) : (
            <BrainCircuit size={18} />
          )}

          <span>{isIndexing ? "Indexing with AI..." : "Index with AI"}</span>
        </button>

        {indexMessage ? (
          <p
            className={[
              "note-details-panel__message",
              indexMessage.includes("searchable")
                ? "note-details-panel__message--success"
                : "note-details-panel__message--error",
            ]
              .filter(Boolean)
              .join(" ")}
            role="status"
          >
            {indexMessage}
          </p>
        ) : null}
      </section>

      <div className="note-details-panel__footer">
        <button
          className="note-details-panel__delete-button"
          type="button"
          onClick={onDelete}
        >
          Delete Note
        </button>
      </div>
    </aside>
  );
}