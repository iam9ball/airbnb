"use server";
import UniqueToken from "@/app/libs/utils/uuid";
import { sendVerificationEmail } from "@/app/providers/mail";
import { prisma } from "@/app/libs/prismadb";

export default async function resendMail(email: string) {
  const token = UniqueToken();
  try {
    const res = await sendVerificationEmail(email, token);
    if (res.status === 200) {
      const user = await prisma.unverifiedUser.findUnique({
        where: { email },
        include: {
          verificationToken: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
      console.log(user);
      console.log(email)

      if (user) {
        console.log(user);
        console.log(email);
       
        if (user.verificationToken.length > 0) {
           const lastTokenId = user.verificationToken[0].id;
          await prisma.verificationToken.update({
            where: { id: lastTokenId },
            data: {
              token: token,
              tokenExpiryTime: new Date(Date.now() + 3 * 60 * 100),
            },
          });
        }
      }
      return { success: "Verification email sent" };
    }
    return { error: "Failed to send verification code" };
  } catch {
    return { error: "Something went wrong" };
  }
}
