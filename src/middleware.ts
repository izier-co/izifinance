// import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { handleSession } from "./app/api/supabase_middleware.config";

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

  const { supabase } = await handleSession(req);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/v1/auth");

  if (!user && !isAuthRoute) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      const url = req.nextUrl.clone();
      url.pathname = "/api/v1/auth/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/((?!v1/auth).*)"],
};
