import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token } = body;
    console.log(email)

    const unverifiedUser = await prisma.unverifiedUser.findUnique({
      where: { email },
    });

    if (!unverifiedUser) {
      return NextResponse.json({ 
        status: 404, 
        message: "User not found or already verified." 
      }, { status: 404 });
    }

    const verifiedToken = await prisma.verificationToken.findUnique({
      where: { email, token },
    });

    if (!verifiedToken) {
      return NextResponse.json({ 
        status: 401, 
        message: "Invalid verification token." 
      }, { status: 401 });
    }

    if (verifiedToken.tokenExpiryTime < new Date()) {
      return NextResponse.json({ 
        status: 401, 
        message: "Verification token has expired. Please request a new one." 
      }, { status: 401 });
    }

    await prisma.user.create({
      data: {
        email: unverifiedUser.email,
        name: unverifiedUser.name,
        hashedPassword: unverifiedUser.hashedPassword,
      },
    });

    await prisma.$transaction([
      prisma.unverifiedUser.delete({ where: { email } }),
      prisma.verificationToken.deleteMany({ where: { email } }),
    ]);


    return NextResponse.json({
      status: 200,
      message: "User successfully verified and registered.",
      
    }, { status: 200 });

  } catch (error) {
    console.error("Error during user verification:", error);
    return NextResponse.json({ 
      status: 500, 
      message: "An unexpected error occurred. Please try again later." 
    }, { status: 500 });
  }
}