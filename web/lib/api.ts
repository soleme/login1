import { clearAccessToken, getAccessToken } from "./auth";

export type Role = "USER" | "ADMIN";

export type User = {
  id: string;
  loginId: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken();
    }

    let payload: ApiErrorPayload | null = null;

    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = null;
    }

    const message = Array.isArray(payload?.message)
      ? payload.message.join(" ")
      : payload?.message ?? payload?.error ?? "Request failed.";

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function register(input: { loginId: string; password: string; name: string }) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { loginId: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMe() {
  return request<User>("/auth/me");
}

export function getAdminUsers() {
  return request<User[]>("/admin/users");
}

export function deleteAdminUser(id: string) {
  return request<void>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
