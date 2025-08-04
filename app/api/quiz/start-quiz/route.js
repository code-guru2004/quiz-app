import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    try {
        const { quizId, email, username } = await request.json();

        if (!quizId || !email || !username) {
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

        // Check if user already started or submitted
        const alreadyExists = quiz.userSubmissions.find(
            (s) => s.email === email && (s.status === "started" || s.status === "submitted")
        );

        if (alreadyExists) {
            return NextResponse.json(
                { success: false, message: "User already started/submitted this quiz" },
                { status: 200 }
            );
        }

        // Push "started" submission
        quiz.userSubmissions.push({
            email,
            username,
            status: "started",
            startedAt: new Date(),
        });

        await quiz.save();

        return NextResponse.json(
            { success: true, message: "Quiz started successfully", },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error starting quiz:", error);
        return NextResponse.json(
            { success: false, message: "Server error starting quiz" },
            { status: 500 }
        );
    }
}
