import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
})

// Protect only specific admin routes (excluding login)
export const config = {
  matcher: [
    "/admin/page",
    "/admin/lead-scoring/:path*",
    "/admin/session-recordings/:path*",
    "/admin/attribution/:path*",
    "/admin/form-analytics/:path*"
  ]
}
