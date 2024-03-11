import { db } from "@/lib/prisma"

export const getUserByEmail = (email: string) => {
  try {
    return db.user.findUnique({ where: { email } })
  } catch (error) {}
}

export const getUserById = (id: string) => {
  try {
    return db.user.findUnique({ where: { id } })
  } catch (error) {}
}

export const getUsersByEmail = (email: string) => {
  try {
    return db.user.findMany({ where: { email: { contains: email } } })
  } catch (error) {}
}
