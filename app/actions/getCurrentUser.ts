import {auth} from "@/auth"
import prisma from "../libs/prismaDb";


export async function getSession() {
   const session = await auth();

   if(!session?.user) return null;

   return session?.user;
}

export default async function getCurrentUser() {
    try {
         const session = await getSession();
         if(!session?.email) {
            return null
         }

         const currentUser = await prisma.user.findUnique({
            where: {
                email: session?.email as string
            }
         })

         if(!currentUser) {
            return null;
         }

         return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null
         };

    } catch (error: any) {
         return null
    }
}
