import { apiClient } from "./client";
import type { Resource } from "../types/resource";

export type CreateResourceRequest = {
  title: string;
  type: "BOOK" | "PDF" | "LINK" | "NOTE_MATERIAL";
  fileUrl?: string;
  subject?: string;
};

export function getResources() {
  return apiClient<Resource[]>("/resources");
}

export function getResourceById(id: string) {
  return apiClient<Resource>(`/resources/${id}`);
}

export function createResource(data: CreateResourceRequest) {
  return apiClient<Resource>("/resources", {
    method: "POST",
    body: data,
  });
}

export function deleteResource(id: string) {
  return apiClient<{ message: string }>(`/resources/${id}`, {
    method: "DELETE",
  });
}