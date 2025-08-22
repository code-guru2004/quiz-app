import { NextResponse } from "next/server";


import crypto from "crypto";
import OTPModel from "@/db/schema/OTPModel";
import { transporterAuth } from "@/lib/nodemailerAuth";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Optional: Hash OTP before storing
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Save OTP in DB with expiration (5 min)
    await OTPModel.create({
      email,
      hashedOtp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send OTP email
    await transporterAuth.sendMail({
      from: `"EduProbe" <${process.env.SMTP_USER_AUTH}>`,
      to: email,
      subject: "Your OTP for EduProbe Login",
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`
    });

    return NextResponse.json({ success: true, message: "OTP sent to email" });

  } catch (err) {
    console.error("OTP Error:", err);
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
  }
}
