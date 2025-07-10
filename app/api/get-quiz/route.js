import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    try {
        const quizData = await Quiz.find().sort({ createdAt: -1 });
        // console.log(quizData);
        if (!quizData) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Quiz data not found"
                },
                {
                    status: 400,
                }
            );
                
        }
        return NextResponse.json(
            {
                success: true,
                quiz: quizData,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong during fetching quiz data",
            },
            { status: 500 }
        );
    }
}