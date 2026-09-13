import { BrainCircuit, Clock3, FileText, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import type { Notebook } from "../../types/notebook";

type NoteCardProps = {
  note: Notebook;
  isIndexing?: boolean;
  onIndex: (noteId: string) => void;
};

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const now = new Date();

  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInMinutes < 1) {
    return "Just now";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  }

  if (differenceInHours < 24) {
    return `${differenceInHours} hour${differenceInHours === 1 ? "" : "s"} ago`;
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} day${differenceInDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getPreview(content: string, maximumLength = 210) {
  if (content.length <= maximumLength) {
    return content;
  }

  return `${content.slice(0, maximumLength).trim()}…`;
}

export function NoteCard({
  note,
  isIndexing = false,
  onIndex,
}: NoteCardProps) {
  return (
    <article className="note-card">
      <Link
        className="note-card__main"
        to={`/notebooks/${note.id}`}
        aria-label="Open notebook note"
      >
        <p className="note-card__content">{getPreview(note.content)}</p>

        <div className="note-card__meta">
          <span>{formatRelativeDate(note.createdAt)}</span>

          <div className="note-card__links">
            {note.resource ? (
              <span className="note-card__chip">
                <FileText size={14} />
                {note.resource.title}
              </span>
            ) : null}

            {note.session ? (
              <span className="note-card__chip">
                <Clock3 size={14} />
                Study session
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="note-card__actions">
        <button
          className="note-card__index-button"
          type="button"
          onClick={() => onIndex(note.id)}
          disabled={isIndexing}
          title="Index this note with AI semantic search"
        >
          <BrainCircuit size={15} />

          <span>{isIndexing ? "Indexing..." : "Index with AI"}</span>
        </button>

        <Link
          className="note-card__more-button"
          to={`/notebooks/${note.id}`}
          aria-label="Open note actions"
          title="Open note"
        >
          <MoreVertical size={20} />
        </Link>
      </div>
    </article>
  );
}