import { prisma } from "@/app/libs/prismadb";
import { sendVerificationEmail } from "@/app/providers/mail";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import UniqueToken from "@/app/libs/utils/uuid";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const token = UniqueToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tokenExpiryTime = new Date(Date.now() + 3 * 60 * 1000);

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    const existingUnverifiedUser = await prisma.unverifiedUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use." },
        { status: 400 }
      );
    }

    // Create unverified user

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, token);

    if (emailResponse?.status === 500) {
      return NextResponse.json(
        { error: "Something went wrong while sending email." },
        { status: 500 }
      );
    } else if (emailResponse?.status === 200) {
      if (!existingUnverifiedUser) {
        await prisma.unverifiedUser.create({
          data: {
            email,
            name,
            hashedPassword,
            expiresAt,
          },
        });

        // Create verification token
        await prisma.verificationToken.create({
          data: {
            email,
            token,
            tokenExpiryTime,
          },
        });
      } else if (existingUnverifiedUser) {
        await prisma.unverifiedUser.update({
          where: { email },
          data: {
            name,
            hashedPassword,
            expiresAt,
          },
        });
        await prisma.verificationToken.create({
          data: {
            email,
            token,
            tokenExpiryTime,
          },
        });
      }

      return NextResponse.json({
        message: "Verification email sent successfully.",
        status: 200,
        email,
      });
    }

    // Fallback for any unexpected email response
    return NextResponse.json({
      error: "Unexpected response from email service.",
      status: 500,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
