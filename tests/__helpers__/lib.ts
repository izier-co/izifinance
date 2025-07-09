import { NextRequest } from "next/server";

const url = "localhost:3000";

export function createMockRequestWithBody(
  method: string,
  body: Record<string, any>,
  headers?: Record<string, string>
) {
  const request = new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers, // extra headers goes to here
    },
    body: JSON.stringify(body),
  });
  return new NextRequest(request);
}
