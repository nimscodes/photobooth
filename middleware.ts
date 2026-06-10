import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Fast pre-check: format (uuid:exp:hmac) and expiry
    // Full HMAC verification happens in server components and API routes
    const parts = session.split(":");
    if (parts.length !== 3) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const exp = parseInt(parts[1], 10);
    if (isNaN(exp) || Math.floor(Date.now() / 1000) > exp) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
