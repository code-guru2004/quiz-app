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

    const totalTime = [...user.submitQuiz.map(q => q.time), ...user.aiQuizzes.map(q => q.totalTime)];
    const avgTime = totalTime.length ? (totalTime.reduce((a,b)=>a+b , 0) / totalTime.length) : 0;
    
    const normalQuiz = [...user.submitQuiz.map(q => q.quizScore)];
    const aiQuiz = [ ...user.aiQuizzes.map(q => q.score)];
    const averageScoreNormalQuizScore = normalQuiz.length ? (normalQuiz.reduce((a, b) => a + b, 0) / normalQuiz.length) : 0;
    const averageScoreAIQuizScore = aiQuiz.length ? (aiQuiz.reduce((a, b) => a + b, 0) / aiQuiz.length) : 0;

    const calendar = {};
    [...user.submitQuiz, ...user.aiQuizzes].forEach(q => {
        const date = new Date(q.submittedAt || q.createdAt).toISOString().split('T')[0];
        calendar[date] = (calendar[date] || 0) + 1;
    });

    // --- Add quiz title and time array
    const quizTitleAndTime = [
        ...user.submitQuiz.map(q => ({
            title: q.quizTitle || 'Untitled Quiz',
            time: q.time || 0
        })),
        ...user.aiQuizzes.map(q => ({
            title: q.title || 'AI Quiz',
            time: q.totalTime || 0
        }))
    ];

    return NextResponse.json({
        success: true,
        data: {
            NoOrdinayQuiz: user.submitQuiz.length,
            NoAIQuizzes: user.aiQuizzes.length,
            calendar,
            totalTime,
            avgTime,
            averageScoreNormalQuizScore,
            averageScoreAIQuizScore,
            quizTitleAndTime
        }
    });
}
