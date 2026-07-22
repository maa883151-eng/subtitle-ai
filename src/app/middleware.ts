import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const clerkAuth = clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

export function middleware(req: NextRequest) {
  if (process.env.DEMO_MODE === "true") return NextResponse.next();
  return (clerkAuth as any)(req);
}

export const config = { matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"] };
