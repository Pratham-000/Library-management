import type { ResourcePreview } from "./resource";

export type StudySessionStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type StudySession = {
  id: string;
  userId: string;
  resourceId: string | null;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  status: StudySessionStatus;
  createdAt: string;
  resource: ResourcePreview | null;
  notes: {
    id: string;
    content: string;
    createdAt: string;
  }[];
};

export type StudySessionPreview = Pick<
  StudySession,
  "id" | "status" | "durationMinutes" | "startTime"
>;

export type CreateStudySessionRequest = {
  resourceId?: string;
};

export type FinishStudySessionRequest = {
  status: "COMPLETED" | "CANCELLED";
};

export type StudySessionFilter =
  | "ALL"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";