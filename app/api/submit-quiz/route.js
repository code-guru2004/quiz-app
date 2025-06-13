
import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { quizId, email, score } = await request.json();
    console.log(quizId,email);
    
    if (!quizId || !email || typeof score !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }

    // Check if user already submitted
    const existingSubmission = quiz.userSubmissions.find(
      (submission) => submission.email === email
    );
    

    if (existingSubmission) {
      // Optional: allow updating score if re-submitting
      // existingSubmission.score = score;
      // existingSubmission.submittedAt = new Date();
      return NextResponse.json(
        { success: false, message: "You have already attend the quiz" },
        { status: 200 }
      );
    } else {
      // Add new submission
      quiz.userSubmissions.push({
        email,
        score,
        submittedAt: new Date(),
      });
    }

    await quiz.save();

    return NextResponse.json(
      { success: true, message: "Quiz submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { success: false, message: "Server error submitting quiz" },
      { status: 500 }
    );
  }
}
