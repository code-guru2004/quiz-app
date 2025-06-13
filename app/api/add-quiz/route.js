import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { quizTitle, quizIcon, quizQuestions,quizDescription,quizTime } = await request.json();
    console.log(quizTitle, quizIcon, quizQuestions,quizDescription,quizTime);
    
    // Optional: Add basic validation
    if (!quizTitle || !Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data: quizTitle and quizQuestions are required",
        },
        { status: 422 }
      );
    }

    await Quiz.create({ quizTitle, quizIcon, quizQuestions,quizDescription,quizTime });

    return NextResponse.json(
      {
        success: true,
        message: "Quiz added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding quiz:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during adding quiz",
      },
      { status: 500 }
    );
  }
}
