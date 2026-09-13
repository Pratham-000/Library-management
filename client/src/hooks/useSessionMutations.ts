import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStudySession,
  deleteStudySession,
  finishStudySession,
} from "../api/sessions.api";
import { sessionKeys } from "./useSessions";
import type {
  CreateStudySessionRequest,
  FinishStudySessionRequest,
} from "../types/session";

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudySessionRequest = {}) => {
      return createStudySession(data);
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: sessionKeys.list(),
      });
    },
  });
}

export function useFinishSession(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FinishStudySessionRequest) => {
      return finishStudySession(id, data);
    },

    onSuccess: (updatedSession) => {
      queryClient.setQueryData(
        sessionKeys.detail(id),
        updatedSession,
      );

      void queryClient.invalidateQueries({
        queryKey: sessionKeys.list(),
      });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteStudySession(id);
    },

    onSuccess: (_deletedResponse, deletedSessionId) => {
      queryClient.removeQueries({
        queryKey: sessionKeys.detail(deletedSessionId),
      });

      void queryClient.invalidateQueries({
        queryKey: sessionKeys.list(),
      });
    },
  });
}