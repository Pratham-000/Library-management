import { useState } from "react";
import { createResource } from "../../api/resources.api";
import type { ResourceType } from "../../types/resource";

type ResourceFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const resourceTypes: ResourceType[] = [
  "BOOK",
  "PDF",
  "LINK",
  "NOTE_MATERIAL",
];

export function ResourceForm({
  onSuccess,
  onCancel,
}: ResourceFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ResourceType>("BOOK");
  const [subject, setSubject] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await createResource({
        title: trimmedTitle,
        type,
        subject: subject.trim() || undefined,
        fileUrl: fileUrl.trim() || undefined,
      });

      onSuccess();
    } catch {
      setError("Unable to create resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="resource-form"
      onSubmit={handleSubmit}
    >
      <label className="resource-form__field">
        <span>Title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Clean Code"
          disabled={isSubmitting}
          required
        />
      </label>

      <label className="resource-form__field">
        <span>Type</span>
        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value as ResourceType)
          }
          disabled={isSubmitting}
        >
          {resourceTypes.map((resourceType) => (
            <option key={resourceType} value={resourceType}>
              {resourceType.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="resource-form__field">
        <span>Subject</span>
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="e.g. Software Engineering"
          disabled={isSubmitting}
        />
      </label>

      <label className="resource-form__field">
        <span>File or link URL</span>
        <input
          type="url"
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          placeholder="https://example.com/resource"
          disabled={isSubmitting}
        />
      </label>

      {error ? (
        <p className="resource-form__error">{error}</p>
      ) : null}

      <div className="resource-form__actions">
        <button
          type="button"
          className="resource-form__cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="resource-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Resource"}
        </button>
      </div>
    </form>
  );
}