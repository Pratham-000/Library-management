import { Link, useNavigate, useParams } from "react-router-dom";
import { useResource } from "../hooks/useResources";
import { useSessions } from "../hooks/useSessions";
import { useCreateSession } from "../hooks/useSessionMutations";
import type { ResourceType } from "../types/resource";
import { formatDateTime } from "../utils/formatters";

function formatResourceType(type: ResourceType): string {
  return type.replace("_", " ");
}

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: resource, isLoading, isError } = useResource(id);
  const { data: sessions } = useSessions();
  const createSession = useCreateSession();

  const hasActiveSession =
    sessions?.some((session) => session.status === "ACTIVE") ?? false;

  function handleStartStudying() {
    if (!resource) {
      return;
    }

    if (hasActiveSession) {
      navigate("/sessions/active");
      return;
    }

    createSession.mutate(
      {
        resourceId: resource.id,
      },
      {
        onSuccess: () => {
          navigate("/sessions/active");
        },
      },
    );
  }

  if (isLoading) {
    return (
      <section className="resource-detail-page">
        <div className="resource-detail-state">
          Loading resource...
        </div>
      </section>
    );
  }

  if (isError || !resource) {
    return (
      <section className="resource-detail-page">
        <div className="resource-detail-state">
          <h1>Resource not found</h1>
          <p>This resource could not be loaded.</p>

          <Link
            to="/resources"
            className="resource-detail__secondary-action"
          >
            Back to Resources
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="resource-detail-page">
      <header className="page-header">
        <div>
          <p className="resource-detail-page__eyebrow">
            {formatResourceType(resource.type)}
          </p>

          <h2>{resource.title}</h2>

          <p className="page-header__description">
            {resource.subject ?? "No subject assigned"}
          </p>
        </div>

        <div className="page-header__actions">
          <button
            type="button"
            className="resource-detail__study-action"
            onClick={handleStartStudying}
            disabled={createSession.isPending}
          >
            {createSession.isPending
              ? "Starting..."
              : hasActiveSession
                ? "Continue Active Session"
                : "Start Studying"}
          </button>
        </div>
      </header>

      <div className="resource-detail-card">
        <div className="resource-detail-card__row">
          <span>Type</span>
          <strong>{formatResourceType(resource.type)}</strong>
        </div>

        <div className="resource-detail-card__row">
          <span>Subject</span>
          <strong>{resource.subject ?? "—"}</strong>
        </div>

        <div className="resource-detail-card__row">
          <span>Added</span>
          <strong>{formatDateTime(resource.createdAt)}</strong>
        </div>

        {resource.fileUrl ? (
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="resource-detail__open-link"
          >
            Open resource
          </a>
        ) : (
          <p className="resource-detail-card__empty">
            This resource has no external file or link attached.
          </p>
        )}
      </div>
    </section>
  );
}