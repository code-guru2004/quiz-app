import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { notifyAllUsersAboutNewQuiz } from "@/lib/notifyAllUsersAboutNewQuiz";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { quizTitle, quizIcon, quizQuestions,quizDescription,quizTime,quizMode,quizCategory} = await request.json();
    console.log( quizQuestions);
    
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
    const newQuiz = new Quiz({ quizTitle, quizIcon, quizQuestions,quizDescription,quizTime,quizMode,quizCategory,minimumTime:(quizTime*60) });

    await newQuiz.save();
    //await Quiz.create({ quizTitle, quizIcon, quizQuestions,quizDescription,quizTime,quizMode,quizCategory,minimumTime:(quizTime*60) });
    await notifyAllUsersAboutNewQuiz(quizTitle, quizMode);

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
