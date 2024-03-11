import authConfig from "@/auth.config"
import { db } from "@/lib/prisma"
import { getUserById } from "@/service/user.service"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole, UserType } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: UserRole
      type: UserType
    }
  }
}

const insiderPostfix = "@poornima.org"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user }) {
      const userType = user.email!.endsWith(insiderPostfix)
        ? UserType.INSIDER
        : UserType.OUTSIDER

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
          type: userType,
        },
      })
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role
      token.type = existingUser.type

      // if (!existingUser.email.endsWith(insiderPostfix)) token.type = "OUTSIDER"

      return token
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (token.type && session.user) {
        session.user.type = token.type as UserType
      }

      return session
    },
  },
  ...authConfig,
})
