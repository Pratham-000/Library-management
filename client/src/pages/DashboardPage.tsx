import {
  BookOpen,
  BrainCircuit,
  Clock3,
  FileText,
  LibraryBig,
  Plus,
  SquarePen,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../hooks/useAuth";

const previewNotes = [
  {
    id: "note-1",
    content:
      "Your notebook notes will appear here after you create them. Save important concepts, ideas, and study reflections in one place.",
    date: "Get started",
    indexed: false,
  },
  {
    id: "note-2",
    content:
      "Use AI Search after indexing a note to find it later using natural language instead of exact keywords.",
    date: "AI Search",
    indexed: true,
  },
];

const previewSessions = [
  {
    id: "session-1",
    status: "No active session",
    resource: "Start a focused study session",
    duration: "—",
    tone: "active",
  },
  {
    id: "session-2",
    status: "Ready when you are",
    resource: "Track time spent studying",
    duration: "—",
    tone: "completed",
  },
];

function getFirstName(name?: string) {
  return name?.trim().split(" ")[0] || "Student";
}

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = getFirstName(user?.name);

  return (
    <section className="dashboard-page">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here is what is happening in your study workspace."
        actions={
          <div className="dashboard-page__header-actions">
            <Link className="dashboard-action dashboard-action--secondary" to="/resources/new">
              <Plus size={18} />
              <span>Create Resource</span>
            </Link>

            <Link className="dashboard-action dashboard-action--secondary" to="/notebooks">
              <SquarePen size={18} />
              <span>New Note</span>
            </Link>

            <Link className="dashboard-action dashboard-action--primary" to="/sessions">
              <Timer size={18} />
              <span>Start Session</span>
            </Link>
          </div>
        }
      />

      <div className="dashboard-stats">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__label">
            <Clock3 size={20} />
            <span>Active Session</span>
          </div>
          <strong>None active</strong>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__label">
            <FileText size={20} />
            <span>Total Notes</span>
          </div>
          <strong>—</strong>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__label">
            <LibraryBig size={20} />
            <span>Resources Saved</span>
          </div>
          <strong>—</strong>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card__label">
            <Timer size={20} />
            <span>Study Time</span>
          </div>
          <strong>—</strong>
        </article>
      </div>

      <div className="dashboard-page__grid">
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h3>Recent Notes</h3>
            <Link to="/notebooks">View all</Link>
          </div>

          <div className="dashboard-note-list">
            {previewNotes.map((note) => (
              <Link
                className="dashboard-note-card"
                key={note.id}
                to="/notebooks"
              >
                <p>{note.content}</p>

                <div className="dashboard-note-card__meta">
                  <span>{note.date}</span>

                  {note.indexed ? (
                    <span className="dashboard-indexed-badge">
                      <BrainCircuit size={14} />
                      Indexed
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h3>Recent Study Sessions</h3>
            <Link to="/sessions">View all</Link>
          </div>

          <div className="dashboard-session-list">
            {previewSessions.map((session) => (
              <Link
                className="dashboard-session-card"
                key={session.id}
                to="/sessions"
              >
                <div>
                  <span
                    className={[
                      "dashboard-session-card__badge",
                      `dashboard-session-card__badge--${session.tone}`,
                    ].join(" ")}
                  >
                    {session.status}
                  </span>

                  <p>{session.resource}</p>
                </div>

                <strong>{session.duration}</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-resource-summary">
        <div className="dashboard-section__header">
          <h3>Resource Summary</h3>
        </div>

        <div className="dashboard-resource-summary__content">
          <div className="dashboard-resource-summary__item">
            <BookOpen size={21} />
            <div>
              <strong>Resources</strong>
              <span>Create your first resource</span>
            </div>
          </div>

          <Link
            className="dashboard-resource-summary__button"
            to="/resources/new"
          >
            <Plus size={17} />
            Add Resource
          </Link>
        </div>
      </section>
    </section>
  );
}