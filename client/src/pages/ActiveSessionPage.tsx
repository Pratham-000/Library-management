import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSessions } from "../hooks/useSessions";
import { useFinishSession } from "../hooks/useSessionMutations";
import { formatElapsedTime } from "../utils/formatters";

export function ActiveSessionPage() {
  const navigate = useNavigate();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();

  const activeSession = sessions?.find(
    (session) => session.status === "ACTIVE",
  );

  const { data: session, isLoading: sessionLoading } = useSession(
    activeSession?.id,
  );

  const finishSession = useFinishSession(activeSession?.id ?? "");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!session?.startTime) {
      return;
    }

    const startTime = new Date(session.startTime).getTime();

    function updateElapsedTime() {
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - startTime) / 1000),
      );

      setElapsedSeconds(elapsed);
    }

    updateElapsedTime();

    const intervalId = window.setInterval(updateElapsedTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session?.startTime]);

  function handleComplete() {
    if (!activeSession) {
      return;
    }

    finishSession.mutate(
      { status: "COMPLETED" },
      {
        onSuccess: () => {
          navigate("/sessions");
        },
      },
    );
  }

  function handleCancel() {
    if (!activeSession) {
      return;
    }

    finishSession.mutate(
      { status: "CANCELLED" },
      {
        onSuccess: () => {
          navigate("/sessions");
        },
      },
    );
  }

  if (sessionsLoading || (activeSession && sessionLoading)) {
    return (
      <section className="active-session-page">
        <div className="active-session-empty">
          <p>Loading active session...</p>
        </div>
      </section>
    );
  }

  if (!activeSession) {
    return (
      <section className="active-session-page">
        <div className="active-session-empty">
          <h1>No active session</h1>
          <p>Start a study session before opening the timer.</p>

          <button
            type="button"
            className="active-session-secondary-button"
            onClick={() => navigate("/sessions")}
          >
            Back to Sessions
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="active-session-page">
      <header className="page-header">
        <div>
          <p className="active-session-page__eyebrow">Focus mode</p>
          <h2>Active Study Session</h2>
          <p className="page-header__description">
            Stay focused and track the time you spend learning.
          </p>
        </div>
      </header>

      <div className="active-session-card">
        <div className="active-session-card__resource">
          <span className="active-session-card__label">
            Currently studying
          </span>

          {session?.resource ? (
            <span className="active-session-card__resource-name">
              {session.resource.title}
            </span>
          ) : (
            <span className="active-session-card__no-resource">
              No resource linked
            </span>
          )}
        </div>

        <div className="active-session-timer">
          <span className="active-session-timer__value">
            {formatElapsedTime(elapsedSeconds)}
          </span>

          <span className="active-session-timer__label">
            Elapsed time
          </span>
        </div>

        <div className="active-session-card__actions">
          <button
            type="button"
            onClick={handleCancel}
            disabled={finishSession.isPending}
            className="active-session-secondary-button"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleComplete}
            disabled={finishSession.isPending}
            className="active-session-primary-button"
          >
            {finishSession.isPending ? "Saving..." : "Complete Session"}
          </button>
        </div>
      </div>
    </section>
  );
}