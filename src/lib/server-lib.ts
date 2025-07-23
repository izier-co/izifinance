"use server";
import { headers } from "next/headers";

export async function fetchJSONAPI(
  method: string,
  url: string,
  jsonBody?: object
) {
  const cookieHeaders = await headers();

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = cookieHeaders.get("host");

  if (!host) throw new Error("Cannot determine URL! Missing host header");

  const domain = `${protocol}://${host}`;
  const fullURL = domain + url;

  return await fetch(fullURL, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeaders.get("cookie") as string,
    },
    body: JSON.stringify(jsonBody),
  });
}
