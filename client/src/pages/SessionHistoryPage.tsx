import { useState } from "react";
import { Link } from "react-router-dom";
import { StartSessionDialog } from "../components/sessions/StartSessionDialog";
import { useSessions } from "../hooks/useSessions";
import type { StudySessionFilter } from "../types/session";
import {
  formatDateTime,
  formatDurationMinutes,
} from "../utils/formatters";

const filters: StudySessionFilter[] = [
  "ALL",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

export function SessionHistoryPage() {
  const { data: sessions, isLoading, isError } = useSessions();
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [filter, setFilter] = useState<StudySessionFilter>("ALL");

  const filtered =
    sessions?.filter((session) => {
      return filter === "ALL" || session.status === filter;
    }) ?? [];

  const hasActive =
    sessions?.some((session) => session.status === "ACTIVE") ?? false;

  return (
    <section className="sessions-page">
      <header className="page-header">
        <div>
          <p className="sessions-page__eyebrow">Learning activity</p>
          <h2>Study Sessions</h2>
          <p className="page-header__description">
            Track focused study time and review your completed sessions.
          </p>
        </div>

        <div className="page-header__actions">
          {hasActive ? (
            <Link
              to="/sessions/active"
              className="sessions-page__primary-action"
            >
              Continue Active Session
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsStartDialogOpen(true)}
              className="sessions-page__primary-action"
            >
              Start Session
            </button>
          )}
        </div>
      </header>

      <div
        className="sessions-filter-bar"
        role="group"
        aria-label="Filter study sessions"
      >
        {filters.map((currentFilter) => {
          const isSelected = filter === currentFilter;

          return (
            <button
              key={currentFilter}
              type="button"
              onClick={() => setFilter(currentFilter)}
              className={`sessions-filter-button ${
                isSelected ? "sessions-filter-button--active" : ""
              }`}
            >
              {currentFilter}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="sessions-empty-state">
          Loading sessions...
        </div>
      ) : isError ? (
        <div className="sessions-empty-state">
          <h3>Unable to load sessions</h3>
          <p>Please refresh the page and try again.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sessions-empty-state">
          <h3>No sessions found</h3>
          <p>
            Start a study session to begin tracking your focused learning time.
          </p>
        </div>
      ) : (
        <div className="sessions-table-wrap">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Started at</th>
                <th>Duration</th>
                <th>Status</th>
                <th className="sessions-table__actions-heading">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((session) => (
                <tr key={session.id}>
                  <td>
                    {session.resource ? (
                      <Link
                        to={`/resources/${session.resource.id}`}
                        className="sessions-table__resource-link"
                      >
                        {session.resource.title}
                      </Link>
                    ) : (
                      <span className="sessions-table__empty-value">
                        No resource
                      </span>
                    )}
                  </td>

                  <td>{formatDateTime(session.startTime)}</td>

                  <td>
                    {formatDurationMinutes(session.durationMinutes)}
                  </td>

                  <td>
                    <span
                      className={`sessions-status-badge sessions-status-badge--${session.status.toLowerCase()}`}
                    >
                      {session.status}
                    </span>
                  </td>

                  <td className="sessions-table__actions">
                    {session.status === "ACTIVE" ? (
                      <Link
                        to="/sessions/active"
                        className="sessions-table__continue-link"
                      >
                        Continue
                      </Link>
                    ) : (
                      <span className="sessions-table__empty-value">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StartSessionDialog
        open={isStartDialogOpen}
        onClose={() => setIsStartDialogOpen(false)}
      />
    </section>
  );
}