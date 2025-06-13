import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();
    try {
        const {id} = await request.json();
        console.log(id);
        const deleteQuiz = await Quiz.findByIdAndDelete(id);
        if(!deleteQuiz){
            return NextResponse.json(
                {
                    success: false,
                    message: "Something went wrong during deleting quiz",
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: "Quiz Deleted Successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong during deleting quiz",
            },
            { status: 500 }
        );
    }
}