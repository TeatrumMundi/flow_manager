export { auth as middleware } from "@/authentication/auth";

// Run middleware only for profile routes
export const config = {
  matcher: ["/profile/:path*"],
};
