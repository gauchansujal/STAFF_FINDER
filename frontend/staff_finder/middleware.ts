import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // no token → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // decode role from JWT
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf-8")
      );
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};