import { apiClient } from "./client";
import type {
  CreateNotebookRequest,
  Notebook,
  UpdateNotebookRequest,
} from "../types/notebook";

export function getNotebooks() {
  return apiClient<Notebook[]>("/notebooks");
}

export function getNotebookById(id: string) {
  return apiClient<Notebook>(`/notebooks/${id}`);
}

export function createNotebook(data: CreateNotebookRequest) {
  return apiClient<Notebook>("/notebooks", {
    method: "POST",
    body: data,
  });
}

export function updateNotebook(id: string, data: UpdateNotebookRequest) {
  return apiClient<Notebook>(`/notebooks/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteNotebook(id: string) {
  return apiClient<{ message: string }>(`/notebooks/${id}`, {
    method: "DELETE",
  });
}

export function indexNotebookWithAI(id: string) {
  return apiClient<{ id: string }>(`/ai/notes/${id}/embed`, {
    method: "POST",
  });
}