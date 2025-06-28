
import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  await dbConnect();

  const { params } = await context;
  const { id } =await params;

  try {
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findById(id) // optional: exclude submissions

    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, quizData: quiz },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
