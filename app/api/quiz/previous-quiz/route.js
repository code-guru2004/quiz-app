import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // Allowed quiz types
    const allowedTypes = ["daily", "weekly", "monthly"];
    if (!type || !allowedTypes.includes(type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid or missing 'type' parameter" },
        { status: 400 }
      );
    }

    const quizType = `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`;
    console.log(quizType);
    
    // Get only previous (ended) quizzes
    const now = new Date();
    const quizzes = await Quiz.find({
      quizType,
      endDate: { $lt: now },
    })
      .sort({ endDate: -1 }) 
      .limit(10); 

    return NextResponse.json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching previous quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch previous quizzes" },
      { status: 500 }
    );
  }
}
