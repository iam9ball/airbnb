import prisma from "@/app/libs/prismaDb";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const body = await request.json();
  const {
    email,
    name,
    password
  } = body;

  const hashedPassword = await bcryptjs.hash(password, 12);

  const user = await prisma.user.create({
    data: {
        email,
        name,
        hashedPassword
    }
  })

  const savedUser = {
    ...user,
    hashedPassword: ""
  }

  return NextResponse.json(savedUser);
}
