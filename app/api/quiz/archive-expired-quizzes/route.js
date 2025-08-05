import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const now = new Date();

    const result = await Quiz.updateMany(
      {
        quizExpiry: { $lt: now },
        isPublish: true,
      },
      {
        $set: { isPublish: false },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Archived ${result.modifiedCount} expired quizzes.`,
    });
  } catch (error) {
    console.error("Error archiving expired quizzes:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
