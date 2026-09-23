import { useQuery } from "@tanstack/react-query";
import {
  getResourceById,
  getResources,
} from "../api/resources.api";

export const resourceKeys = {
  all: ["resources"] as const,
  list: () => [...resourceKeys.all, "list"] as const,
  detail: (id: string) => [...resourceKeys.all, "detail", id] as const,
};

export function useResources() {
  return useQuery({
    queryKey: resourceKeys.list(),
    queryFn: getResources,
  });
}

export function useResource(id: string | undefined) {
  return useQuery({
    queryKey: resourceKeys.detail(id ?? ""),
    queryFn: () => getResourceById(id!),
    enabled: Boolean(id),
  });
}