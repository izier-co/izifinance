import { NextRequest } from "next/server";

const url = "localhost:3000";

export function createMockRequestWithBody(
  method: string,
  body: Record<string, any>
) {
  const request = new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return new NextRequest(request);
}
