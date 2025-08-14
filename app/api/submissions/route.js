// /app/api/leaderboard/route.js or /route.ts (if using TS)
import { NextResponse } from "next/server";


import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";

export async function POST(req) {
  await dbConnect();
  try {

    const { quizId } = await req.json();
    // console.log(quizId);
    
    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required." }, { status: 400 });
    }

    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    // Sort submissions by score (descending) and date (ascending)
    const sortedSubmissions = quiz.userSubmissions
      .sort((a, b) => {
        if (b.score === a.score) {
          return new Date(a.submittedAt) - new Date(b.submittedAt); // earlier wins
        }
        return b.score - a.score;
      });

    return NextResponse.json({ submissions: sortedSubmissions, noOfQuestions: quiz?.quizQuestions.length});
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
