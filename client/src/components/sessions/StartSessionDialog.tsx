import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResources } from "../../hooks/useResources";
import { useCreateSession } from "../../hooks/useSessionMutations";

type StartSessionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function StartSessionDialog({
  open,
  onClose,
}: StartSessionDialogProps) {
  const navigate = useNavigate();
  const { data: resources, isLoading: resourcesLoading } = useResources();
  const createSession = useCreateSession();

  const [resourceId, setResourceId] = useState("");

  if (!open) {
    return null;
  }

  function handleClose() {
    if (createSession.isPending) {
      return;
    }

    setResourceId("");
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createSession.mutate(
      resourceId ? { resourceId } : {},
      {
        onSuccess: () => {
          setResourceId("");
          onClose();
          navigate("/sessions/active");
        },
      },
    );
  }

  return (
    <div
      className="start-session-dialog-overlay"
      role="presentation"
      onMouseDown={handleClose}
    >
      <div
        className="start-session-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-session-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="start-session-dialog__header">
          <div>
            <p className="start-session-dialog__eyebrow">Focus time</p>
            <h2 id="start-session-dialog-title">Start Study Session</h2>
            <p>
              Optionally attach a resource so this focused time appears in its
              study history.
            </p>
          </div>

          <button
            type="button"
            className="start-session-dialog__close"
            onClick={handleClose}
            disabled={createSession.isPending}
            aria-label="Close start session dialog"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="start-session-dialog__form">
          <label
            className="start-session-dialog__field"
            htmlFor="session-resource"
          >
            Resource
            <select
              id="session-resource"
              value={resourceId}
              onChange={(event) => setResourceId(event.target.value)}
              disabled={resourcesLoading || createSession.isPending}
            >
              <option value="">No resource — general study</option>

              {resources?.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.title}
                  {resource.subject ? ` · ${resource.subject}` : ""}
                </option>
              ))}
            </select>
          </label>

          {resourcesLoading ? (
            <p className="start-session-dialog__hint">
              Loading available resources...
            </p>
          ) : resources?.length === 0 ? (
            <p className="start-session-dialog__hint">
              No resources are available yet. You can still start a general
              study session.
            </p>
          ) : null}

          <div className="start-session-dialog__actions">
            <button
              type="button"
              className="start-session-dialog__cancel"
              onClick={handleClose}
              disabled={createSession.isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="start-session-dialog__start"
              disabled={createSession.isPending}
            >
              {createSession.isPending ? "Starting..." : "Start Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}