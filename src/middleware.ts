// import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { handleSession } from "./app/api/supabase_middleware.config";
import { EmailOtpType } from "@supabase/supabase-js";

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

  const isRootRoute = req.nextUrl.pathname === "/";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/v1/auth");
  const isForgotPasswordRoute =
    req.nextUrl.pathname.startsWith("/forgot-password");

  try {
    if (!user && !isAuthRoute && !isRootRoute) {
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
    const searchParams = req.nextUrl.searchParams;
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (error) return NextResponse.redirect(new URL("/", req.url));

      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  if (user && isRootRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
