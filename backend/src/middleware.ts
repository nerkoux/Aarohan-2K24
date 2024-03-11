import { auth as getSession } from "@/auth"
import authConfig from "@/auth.config"
import {
  API_AUTH_PREFIX,
  LOGIN_SUCCESS_REDIRECT,
  adminRoutes,
  authRoutes,
  publicRoutes,
} from "@/route.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

export const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { nextUrl } = req

  /* Using this to get user's Role */
  const session = await getSession()

  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)

  const isAdminRoute = adminRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) return NextResponse.next()

  if (isLoggedIn && isAuthRoute)
    return NextResponse.redirect(new URL(LOGIN_SUCCESS_REDIRECT, nextUrl))

  if (!isLoggedIn && !isPublicRoute)
    return NextResponse.redirect(new URL("/", nextUrl))

  if (isLoggedIn && isAdminRoute) {
    if (session && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/events", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
