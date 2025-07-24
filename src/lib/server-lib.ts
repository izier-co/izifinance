"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getCookies() {
  const cookieHeaders = await headers();
  return cookieHeaders.get("cookie") as string;
}

export async function getDomain() {
  const cookieHeaders = await headers();

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = cookieHeaders.get("host");

  if (!host) throw new Error("Cannot determine URL! Missing host header");

  return `${protocol}://${host}`;
}

export async function refreshPage(path: string) {
  revalidatePath(path);
}
