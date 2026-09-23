import { FileText, LibraryBig } from "lucide-react";
import { Link } from "react-router-dom";
import type { AISearchResult } from "../../types/ai";

type AISearchResultCardProps = {
  result: AISearchResult;
  rank: number;
};

function formatSimilarity(distance: number): string {
  const similarity = Math.max(0, Math.min(1, 1 - distance));
  return `${Math.round(similarity * 100)}% match`;
}

export function AISearchResultCard({
  result,
  rank,
}: AISearchResultCardProps) {
  const isNote = result.entityType === "NOTE";
  const note = result.note;
  const resource = result.resource;

  const title = isNote
    ? "Notebook note"
    : resource?.title ?? "Resource";

  const description = isNote
    ? note?.content ?? result.chunkText
    : resource?.subject ?? result.chunkText;

  const destination = isNote && note
    ? `/notebooks/${note.id}`
    : resource
      ? `/resources/${resource.id}`
      : "/ai-search";

  return (
    <Link to={destination} className="ai-result-card">
      <div className="ai-result-card__icon">
        {isNote ? (
          <FileText size={20} />
        ) : (
          <LibraryBig size={20} />
        )}
      </div>

      <div className="ai-result-card__content">
        <div className="ai-result-card__meta">
          <span>{isNote ? "Notebook note" : "Resource"}</span>
          <span>Result {rank}</span>
        </div>

        <h3>{title}</h3>

        <p>{description}</p>

        <span className="ai-result-card__excerpt">
          Matched text: {result.chunkText}
        </span>
      </div>

      <span className="ai-result-card__score">
        {formatSimilarity(result.distance)}
      </span>
    </Link>
  );
}