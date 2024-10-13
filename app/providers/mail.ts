"use server";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string) => {
    try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Verify your email address",
          html: `<p >Copy and paste this code to verify your email address:${"  "}<strong>${code}</strong></p>`,
        })
            return NextResponse.json({status: 200})
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({status: 500})
    }
   
};
