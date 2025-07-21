"use server";
import { headers } from "next/headers";

export async function fetchJSONAPI(
  method: string,
  url: string,
  jsonBody?: object
) {
  const cookieHeaders = await headers();
  const baseUrl = "http://localhost:3000";
  return await fetch(baseUrl + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeaders.get("cookie") as string,
    },
    body: JSON.stringify(jsonBody),
  });
}
