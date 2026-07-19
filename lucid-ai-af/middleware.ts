import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "lucid_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const role = request.cookies.get(SESSION_COOKIE)?.value;

  // TEMPORARILY DISABLED for demo viewing
  // if (role !== "admin") {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
