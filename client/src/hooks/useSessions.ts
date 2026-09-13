import { useQuery } from "@tanstack/react-query";
import {
  getStudySessionById,
  getStudySessions,
} from "../api/sessions.api";

export const sessionKeys = {
  all: ["sessions"] as const,

  list: () => [...sessionKeys.all, "list"] as const,

  detail: (id: string) => [...sessionKeys.all, "detail", id] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.list(),
    queryFn: getStudySessions,
  });
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.detail(id ?? ""),
    queryFn: () => getStudySessionById(id!),
    enabled: Boolean(id),
  });
}