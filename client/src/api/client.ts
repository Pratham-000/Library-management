import { getToken } from "../lib/storage";
import type { ApiResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    body,
    auth = true,
    headers,
    ...requestOptions
  } = options;

  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const payload = (await response.json()) as ApiResponse<T>;

if (!payload.success) {
  if (response.status === 401) {
    window.dispatchEvent(new Event("online-library:unauthorized"));
  }

  const errorMessage =
    typeof payload.error === "string"
      ? payload.error
      : "Something went wrong. Please try again.";

  throw new Error(errorMessage);
}

if (!response.ok) {
  throw new Error("Something went wrong. Please try again.");
}

return payload.data;
}