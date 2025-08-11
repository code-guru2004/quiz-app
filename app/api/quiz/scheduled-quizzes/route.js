import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    console.log(type);
    
    // Validate query param
    const allowedTypes = ["daily", "weekly", "monthly"];
    if (!type || !allowedTypes.includes(type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid or missing 'type' parameter" },
        { status: 400 }
      );
    }

    // Build quiz type string in schema format
    const quizType = `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`;

    // Find active quizzes of this type
    const now = new Date();
    const quizzes = await Quiz.find({
      quizType,
      startDate: { $lte: now },
      endDate: { $gte: now },
      isPublish: true,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
