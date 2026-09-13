import type { ResourcePreview } from "./resource";
import type { StudySessionPreview } from "./session";

export type Notebook = {
  id: string;
  content: string;
  userId: string;
  resourceId: string | null;
  sessionId: string | null;
  createdAt: string;
  resource: ResourcePreview | null;
  session: StudySessionPreview | null;
};

export type CreateNotebookRequest = {
  content: string;
  resourceId?: string;
  sessionId?: string;
};

export type UpdateNotebookRequest = {
  content: string;
  resourceId?: string | null;
  sessionId?: string | null;
};