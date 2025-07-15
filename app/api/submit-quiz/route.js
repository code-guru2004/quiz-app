
import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { quizId, email, score,perQuestionTimes,totaltime, selectedAnswers } = await request.json();
    console.log(quizId, email, score,{...perQuestionTimes},totaltime, {...selectedAnswers});
    
    if (!quizId || !email || typeof score !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findById(quizId);
    const user = await User.findOne({email});
    // console.log(quiz);
    console.log(email);
    
    console.log("user",user);
    
    
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }
    // console.log(quiz.quizQuestions?.length);
    
    // Check if user already submitted
    const existingSubmission = quiz.userSubmissions?.find(
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
      const minimumTime = Math.min(quiz.minimumTime,totaltime);
      // console.log("totaltime",totaltime);
      
      // Add new submission
      quiz.userSubmissions.push({
        email,
        username:user?.username,
        score,
        submittedAt: new Date(),
        perQuestionTimes,
        selectedAnswers:[...selectedAnswers]
      });
      quiz.minimumTime=minimumTime;

      user.submitQuiz.push({
        quizId:quiz._id,
        quizTitle: quiz.quizTitle,
        quizIcon:quiz.quizIcon || 0,
        quizScore:score,
        quizTotalQuestions:quiz.quizQuestions?.length,
        rank: null,
        time: totaltime,
        quizCategory:quiz.quizCategory,
        quizMode: quiz.quizMode,
      })
    }

    await quiz.save();
    await user.save();

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
