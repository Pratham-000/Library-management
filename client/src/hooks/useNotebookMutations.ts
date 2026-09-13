import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNotebook,
  deleteNotebook,
  indexNotebookWithAI,
  updateNotebook,
} from "../api/notebooks.api";
import { notebookKeys } from "./useNotebooks";
import type {
  CreateNotebookRequest,
  UpdateNotebookRequest,
} from "../types/notebook";

export function useCreateNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotebookRequest) => createNotebook(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notebookKeys.list(),
      });
    },
  });
}

export function useUpdateNotebook(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNotebookRequest) => updateNotebook(id, data),

    onSuccess: (updatedNotebook) => {
      queryClient.setQueryData(
        notebookKeys.detail(id),
        updatedNotebook,
      );

      void queryClient.invalidateQueries({
        queryKey: notebookKeys.list(),
      });
    },
  });
}

export function useDeleteNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotebook(id),

    onSuccess: (_, deletedNotebookId) => {
      queryClient.removeQueries({
        queryKey: notebookKeys.detail(deletedNotebookId),
      });

      void queryClient.invalidateQueries({
        queryKey: notebookKeys.list(),
      });
    },
  });
}

export function useIndexNotebookWithAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => indexNotebookWithAI(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notebookKeys.list(),
      });
    },
  });
}