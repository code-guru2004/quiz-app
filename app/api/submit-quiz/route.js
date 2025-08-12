import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { quizId, email, score, perQuestionTimes, totaltime, selectedAnswers } = await request.json();

    if (!quizId || !email || typeof score !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findById(quizId);
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!quiz) {
      return NextResponse.json({ success: false, message: "Quiz not found" }, { status: 404 });
    }

    // ✅ Check if user already submitted
    const submittedSubmission = quiz.userSubmissions?.find(
      (submission) => submission.email === email && submission.status === "submitted"
    );

    if (submittedSubmission) {
      return NextResponse.json(
        { success: false, message: "You have already submitted the quiz" },
        { status: 200 }
      );
    }

    // ✅ Check if user has a "started" submission
    const startedSubmission = quiz.userSubmissions?.find(
      (submission) => submission.email === email && submission.status === "started"
    );

    const minimumTime = quiz.minimumTime
      ? Math.min(quiz.minimumTime, totaltime)
      : totaltime;

    if (startedSubmission) {
      // ✅ Update the existing started submission
      startedSubmission.status = "submitted";
      startedSubmission.score = score;
      startedSubmission.submittedAt = new Date();
      startedSubmission.perQuestionTimes = perQuestionTimes;
      startedSubmission.selectedAnswers = [...selectedAnswers];
    } else {
      // ✅ No started submission: push new submitted entry
      quiz.userSubmissions.push({
        email,
        username: user?.username,
        score,
        status: "submitted",
        submittedAt: new Date(),
        perQuestionTimes,
        selectedAnswers: [...selectedAnswers],
      });
    }

    // ✅ Update quiz minimum time
    quiz.minimumTime = minimumTime;
    // 1. Get all submitted user submissions sorted by score descending, then time ascending
    const submittedUsers = quiz.userSubmissions
      .filter(sub => sub.status === "submitted")
      .sort((a, b) => {
        // Sort by score descending
        if (b.score !== a.score) return b.score - a.score;
        // If tie in score, sort by time ascending
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        ;
      });

    // 2. Find the rank of current user
    const userRank = submittedUsers.findIndex(sub => sub.email === email) + 1; // +1 because index is zero-based

    // 3. Update the current user's rank in quiz.userSubmissions
    const currentSubmission = quiz.userSubmissions.find(sub => sub.email === email && sub.status === "submitted");
    if (currentSubmission) {
      currentSubmission.rank = userRank;
    }

    // 4. Also update the rank in the user's submitQuiz entry (the last one just pushed)
    const userQuizSubmission = user.submitQuiz.find(sub => sub.quizId.toString() === quiz._id.toString());
    if (userQuizSubmission) {
      userQuizSubmission.rank = userRank;
    }

    // ✅ Add submission to user record
    user.submitQuiz.push({
      quizId: quiz._id,
      quizTitle: quiz.quizTitle,
      quizIcon: quiz.quizIcon || 0,
      quizScore: score,
      quizTotalQuestions: quiz.quizQuestions?.length,
      rank: userRank,
      time: totaltime,
      quizCategory: quiz.quizCategory,
      quizType: quiz.quizType,
    });

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
