import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";


export async function POST() {
  try {
    await dbConnect();

    // ✅ Reset credits for all users
    const result = await User.updateMany({}, { $set: { aiRemainingUses: 5 } });

    return NextResponse.json({
        success: true,
        message: "Daily AI credits reset successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message },
        { status: 500 }
    )

  }
}
