import { apiClient } from "./client";
import type {
  CreateStudySessionRequest,
  FinishStudySessionRequest,
  StudySession,
} from "../types/session";

export function getStudySessions() {
  return apiClient<StudySession[]>("/sessions");
}

export function getStudySessionById(id: string) {
  return apiClient<StudySession>(`/sessions/${id}`);
}

export function createStudySession(data: CreateStudySessionRequest = {}) {
  return apiClient<StudySession>("/sessions", {
    method: "POST",
    body: data,
  });
}

export function finishStudySession(
  id: string,
  data: FinishStudySessionRequest,
) {
  return apiClient<StudySession>(`/sessions/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteStudySession(id: string) {
  return apiClient<{ message: string }>(`/sessions/${id}`, {
    method: "DELETE",
  });
}