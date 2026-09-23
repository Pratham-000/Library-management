import type { ResourceType } from "./resource";

export type AISearchEntityType = "NOTE" | "RESOURCE";

export type AISearchNote = {
  id: string;
  content: string;
  createdAt: string;
};

export type AISearchResource = {
  id: string;
  title: string;
  type: ResourceType;
  subject: string | null;
  fileUrl: string | null;
  createdAt: string;
};

export type AISearchResult = {
  distance: number;
  chunkText: string;
  entityType: AISearchEntityType;
  note: AISearchNote | null;
  resource: AISearchResource | null;
};

export type AISearchRequest = {
  query: string;
  limit?: number;
};