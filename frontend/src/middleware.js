import { NextResponse } from "next/server";

export function middleware(request) {
  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
