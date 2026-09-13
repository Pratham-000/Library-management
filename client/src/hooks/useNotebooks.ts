import { useQuery } from "@tanstack/react-query";
import { getNotebookById, getNotebooks } from "../api/notebooks.api";

export const notebookKeys = {
  all: ["notebooks"] as const,

  list: () => [...notebookKeys.all, "list"] as const,

  detail: (id: string) => [...notebookKeys.all, "detail", id] as const,
};

export function useNotebooks() {
  return useQuery({
    queryKey: notebookKeys.list(),
    queryFn: getNotebooks,
  });
}

export function useNotebook(id: string | undefined) {
  return useQuery({
    queryKey: notebookKeys.detail(id ?? ""),
    queryFn: () => getNotebookById(id!),
    enabled: Boolean(id),
  });
}