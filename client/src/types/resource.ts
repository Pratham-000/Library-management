export type ResourceType = "BOOK" | "PDF" | "LINK" | "NOTE_MATERIAL";

export type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  fileUrl: string | null;
  subject: string | null;
  uploadedById: string;
  createdAt: string;
};

export type ResourcePreview = Pick<Resource, "id" | "title" | "type">;