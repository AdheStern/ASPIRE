import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/aspire/:path*"],
};
