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

    // ✅ Check if user already submitted this quiz
    const submittedSubmission = quiz.userSubmissions?.find(
      (submission) => submission.email === email && submission.status === "submitted"
    );

    if (submittedSubmission) {
      return NextResponse.json(
        { success: false, message: "You have already submitted the quiz" },
        { status: 200 }
      );
    }

    // ✅ Handle started submission if exists
    const startedSubmission = quiz.userSubmissions?.find(
      (submission) => submission.email === email && submission.status === "started"
    );

    const minimumTime = quiz.minimumTime
      ? Math.min(quiz.minimumTime, totaltime)
      : totaltime;

    if (startedSubmission) {
      startedSubmission.status = "submitted";
      startedSubmission.score = score;
      startedSubmission.submittedAt = new Date();
      startedSubmission.perQuestionTimes = perQuestionTimes;
      startedSubmission.selectedAnswers = [...selectedAnswers];
    } else {
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

    quiz.minimumTime = minimumTime;

    // ✅ Ranking logic
    const submittedUsers = quiz.userSubmissions
      .filter(sub => sub.status === "submitted")
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      });

    const userRank = submittedUsers.findIndex(sub => sub.email === email) + 1;

    const currentSubmission = quiz.userSubmissions.find(sub => sub.email === email && sub.status === "submitted");
    if (currentSubmission) {
      currentSubmission.rank = userRank;
    }

    const userQuizSubmission = user.submitQuiz.find(sub => sub.quizId.toString() === quiz._id.toString());
    if (userQuizSubmission) {
      userQuizSubmission.rank = userRank;
    }

    const today = new Date();
    // ✅ Daily streak tracking
    if (quiz.quizType === "Daily Quiz") {
      today.setHours(0, 0, 0, 0);

      if (typeof user.dailyStreak !== "number") {
        user.dailyStreak = 0; // initialize if missing
      }

      if (!user.lastDailyQuizDate) {
        user.dailyStreak = 1;
      } else {
        const lastDaily = new Date(user.lastDailyQuizDate);
        lastDaily.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastDaily) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.dailyStreak += 1;
        } else if (diffDays > 1) {
          user.dailyStreak = 1;
        }
        // diffDays === 0 → already done today (prevent duplicate below)
      }

      user.lastDailyQuizDate = today;
    }

    // ✅ Prevent pushing duplicate daily quiz submissions for today
    const alreadySubmittedToday =
      quiz.quizType === "Daily Quiz" &&
      user.lastDailyQuizDate &&
      new Date(user.lastDailyQuizDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

    if (!(quiz.quizType === "Daily Quiz" && alreadySubmittedToday)) {
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
