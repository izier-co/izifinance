// import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./app/api/supabase_middleware.config";

// const ratelimiter = new Ratelimit({
//   redis: kv,
//   limiter: Ratelimit.slidingWindow(10, "10 s"),
// });

export async function middleware(req: NextRequest) {
  // const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  // console.log(ip);
  // const { success } = await ratelimiter.limit(ip);

  // if (!success) {
  //   return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  // }

  updateSession(req);

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/((?!v1/auth).*)"],
};
