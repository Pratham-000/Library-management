import { apiClient } from "./client";
import type { AuthUser } from "../types/auth";

export function getCurrentUser(token?: string | null) {
  return apiClient<AuthUser>("/auth/me", {
    method: "GET",
    auth: true,
    token,
  });
}