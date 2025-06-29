import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const {
            quizId,
            category,
            level,
            totalQuestions,
            totalTime,
            email,
            score
        } = body;
       

        // Validate required fields
        if (
            !quizId ||
            !email ||
            !category?.trim() ||
            !level?.trim() ||
            !totalQuestions ||
            totalQuestions <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or incomplete quiz data.",
                },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        // Optional: Check for duplicate quizId
        const alreadySubmitted = user.aiQuizzes.some(
            (quiz) => quiz.quizId === quizId
        );
        if (alreadySubmitted) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Quiz with this ID already submitted.",
                },
                { status: 409 }
            );
        }

        // Add quiz to user's record
        user.aiQuizzes.push({
            quizId,
            category,
            level,
            totalQuestions,
            totalTime,
            score
        });

        await user.save();

        return NextResponse.json(
            { success: true, message: "Quiz submitted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return NextResponse.json(
            { success: false, message: "Server error submitting quiz." },
            { status: 500 }
        );
    }
}
