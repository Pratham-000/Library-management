import { apiClient } from "./client";
import type {
  AISearchRequest,
  AISearchResult,
} from "../types/ai";

export function searchAI(
  query: string,
  limit = 5,
) {
  const data: AISearchRequest = {
    query,
    limit,
  };

  return apiClient<AISearchResult[]>("/ai/search", {
    method: "POST",
    body: data,
  });
}

export function embedResource(resourceId: string) {
  return apiClient<unknown>(`/ai/resources/${resourceId}/embed`, {
    method: "POST",
  });
}

export function embedNote(noteId: string) {
  return apiClient<unknown>(`/ai/notes/${noteId}/embed`, {
    method: "POST",
  });
}