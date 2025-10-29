import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/stripe"],
  afterAuth: (auth, req) => {
    const { pathname } = req.nextUrl;
    // Gate teacher area by role cookie set from the role modal
    if (pathname.startsWith("/teacher")) {
      const roleCookie = req.cookies.get("user_role")?.value;
      if (roleCookie !== "teacher") {
        const url = req.nextUrl.clone();
        url.pathname = "/learn";
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  },
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};