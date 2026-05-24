import { NextRequest } from "next/server";
import { signToken } from "@/lib/jwt";

export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    token?: { userId: string; email: string; role: "admin" | "user" };
    searchParams?: Record<string, string>;
  } = {}
): NextRequest {
  const fullUrl = new URL(url, "http://localhost:3000");
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([k, v]) =>
      fullUrl.searchParams.set(k, v)
    );
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  if (options.token) {
    headers.set("Authorization", `Bearer ${signToken(options.token)}`);
  }

  const init: RequestInit = {
    method: options.method || "GET",
    headers,
  };

  if (options.body) {
    init.body = JSON.stringify(options.body);
  }

  return new NextRequest(fullUrl, init);
}
