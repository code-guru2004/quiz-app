import { NextResponse } from "next/server";
import crypto from "crypto";
import OTPModel from "@/db/schema/OTPModel";
import User from "@/db/schema/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, username, password } = await req.json();
    if (!email || !otp || !username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash incoming OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Find OTP record
    const otpRecord = await OTPModel.findOne({
      email,
      hashedOtp: hashedOTP,
      used: false,
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
        return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
      }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
      }
      
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
