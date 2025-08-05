
import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    
    if (!username) {
        return NextResponse.json({ success: false, message: "Username required" }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // --- Stats
    const totalQuizzes = user.submitQuiz.length + user.aiQuizzes.length;

    const allScores = [...user.submitQuiz.map(q => q.quizScore), ...user.aiQuizzes.map(q => q.score)];
    const averageScore = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

    const categories = {};
    user.submitQuiz.forEach(q => {
        categories[q.quizCategory] = (categories[q.quizCategory] || 0) + 1;
    });
    user.aiQuizzes.forEach(q => {
        categories[q.category] = (categories[q.category] || 0) + 1;
    });

    const calendar = {};
    [...user.submitQuiz, ...user.aiQuizzes].forEach(q => {
        const date = new Date(q.submittedAt || q.createdAt).toISOString().split('T')[0];
        calendar[date] = (calendar[date] || 0) + 1;
    });

    return NextResponse.json({
        success: true,
        data: {
            totalQuizzes,
            averageScore,
            categories,
            calendar
        }
    });
}
