import { auth } from "@/auth";
import { prisma } from "../libs/prismadb";
import { SafeUser } from "../types";
import { User } from "@prisma/client";

export async function getSession() {
  const session = await auth();

  if (!session?.user) return null;
  return session?.user;
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return null;
    }
    const currentUser: SafeUser | User = await prisma.user.findUnique({
      where: {
        email: session.email as string,
      },
    });
    if (!currentUser) {
      return null;
    }

    const user = {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    } 
    return user 
  } catch (error) {
    console.log(error)
    return null;
  }
}
