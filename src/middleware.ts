export { auth as middleware } from "@/Authentication/auth";

// Run middleware only for profile routes
export const config = {
  matcher: ["/profile/:path*"],
};
