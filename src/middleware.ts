import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ratelimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const { success } = await ratelimiter.limit(ip);

  if (!success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
