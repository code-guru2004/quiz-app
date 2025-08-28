// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";

export async function POST(req) {
  try {
    const { token } = await req.json(); // ✅ token from body

    if (!token) {
      return NextResponse.json({ message: "❌ Token is required." }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_2);

    await dbConnect();
    await User.findOneAndUpdate(
      { email: decoded.email },
      { subscribed: false }
    );

    return NextResponse.json({ message: "✅ You have successfully unsubscribed." });
  } catch (error) {
    return NextResponse.json({ message: "❌ Invalid or expired link." }, { status: 400 });
  }
}
