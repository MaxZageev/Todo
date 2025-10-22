export class ApiError extends Error {
  status: number;

  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const shouldAttachAuth = (url: URL) => {
  const path = url.pathname.replace(/\/+$|$/, "");
  const normalized = path || "/";
  if (normalized.includes("/todos")) {
    return true;
  }
  if (normalized.endsWith("/auth/me")) {
    return true;
  }
  if (normalized.endsWith("/auth/change-password")) {
    return true;
  }
  return false;
};

const mergeHeaders = (init?: RequestInit) => {
  const headers = new Headers(init?.headers ?? undefined);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
};

const parseErrorBody = async (response: Response) => {
  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    const text = await response.text();
    return text ? { message: text } : {};
  } catch {
    return {};
  }
};

const extractErrorMessage = (status: number, payload: unknown) => {
  if (payload && typeof payload === "object") {
    const candidate = (payload as { message?: string; error?: string }).message ?? (payload as { message?: string; error?: string }).error;
    if (candidate) {
      return candidate;
    }
  }
  if (status === 401) {
    return "Unauthorized";
  }

  if (status === 403) {
    return "Forbidden";
  }

  return `Request failed with status ${status}`;
};

const parseJsonResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (response.status === 204) {
    return undefined;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
};

export type ApiFetchOptions = RequestInit & {
  parse?: "json" | "text" | "none";
};

export const apiFetch = async <T>(input: URL | string, options: ApiFetchOptions = {}): Promise<T> => {
  const { parse, ...fetchOptions } = options;
  const url = input instanceof URL ? input : new URL(input);
  const headers = mergeHeaders(fetchOptions);

  if (accessToken && shouldAttachAuth(url)) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url.toString(), { ...fetchOptions, headers });

  if (!response.ok) {
    const errorBody = await parseErrorBody(response);
    const message = extractErrorMessage(response.status, errorBody);
    throw new ApiError(response.status, message, errorBody);
  }

  if (parse === "none") {
    return undefined as T;
  }

  if (parse === "text") {
    const text = await response.text();
    return text as unknown as T;
  }

  const data = await parseJsonResponse(response);
  return data as T;
};
