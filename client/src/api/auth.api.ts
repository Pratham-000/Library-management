import { apiClient } from "./client";
import type { LoginRequest, LoginResponse } from "../types/auth";

export function loginUser(credentials: LoginRequest) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });
}