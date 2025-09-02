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
  } = await supabase.auth.getUser();

  if (req.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  const isRootRoute = req.nextUrl.pathname === "/";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/v1/auth");
  const isForgotPasswordRoute =
    req.nextUrl.pathname.startsWith("/forgot-password");

  const hasRecoveryParams =
    req.nextUrl.searchParams.has("token_hash") &&
    req.nextUrl.searchParams.get("type") === "recovery";

  try {
    if (!user && !isAuthRoute && !isRootRoute) {
      if (isForgotPasswordRoute && hasRecoveryParams) {
        return NextResponse.next();
      }
      if (isApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    if ((error as Error).name === "AuthSessionMissingError") {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 401 }
      );
    }
  }
  if (isForgotPasswordRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
