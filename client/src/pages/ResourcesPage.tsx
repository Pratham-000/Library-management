import { Link } from "react-router-dom";
import { useResources } from "../hooks/useResources";
import type { ResourceType } from "../types/resource";
import { formatDateTime } from "../utils/formatters";

function formatResourceType(type: ResourceType): string {
  return type.replace("_", " ");
}

export function ResourcesPage() {
  const { data: resources, isLoading, isError } = useResources();

  return (
    <section className="resources-page">
      <header className="page-header">
        <div>
          <p className="resources-page__eyebrow">Your library</p>
          <h2>Resources</h2>
          <p className="page-header__description">
            Browse the books, PDFs, links, and study materials in your library.
          </p>
        </div>

        <div className="page-header__actions">
          <Link
            to="/resources/new"
            className="resources-page__primary-action"
          >
            Add Resource
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div className="resources-empty-state">Loading resources...</div>
      ) : isError ? (
        <div className="resources-empty-state">
          <h3>Unable to load resources</h3>
          <p>Please refresh the page and try again.</p>
        </div>
      ) : resources?.length === 0 ? (
        <div className="resources-empty-state">
          <h3>No resources yet</h3>
          <p>Add a resource so you can attach study sessions to it.</p>
          <Link
            to="/resources/new"
            className="resources-page__primary-action"
          >
            Add your first resource
          </Link>
        </div>
      ) : (
        <div className="resources-grid">
          {resources?.map((resource) => (
            <Link
              key={resource.id}
              to={`/resources/${resource.id}`}
              className="resource-card"
            >
              <div className="resource-card__top">
                <span className="resource-card__type">
                  {formatResourceType(resource.type)}
                </span>

                <span className="resource-card__arrow">→</span>
              </div>

              <h3>{resource.title}</h3>

              {resource.subject ? (
                <p className="resource-card__subject">
                  {resource.subject}
                </p>
              ) : (
                <p className="resource-card__subject">
                  No subject assigned
                </p>
              )}

              <span className="resource-card__date">
                Added {formatDateTime(resource.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}