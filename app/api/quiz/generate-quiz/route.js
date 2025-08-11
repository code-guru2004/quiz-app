import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return NextResponse.json({ error: "Invalid quiz type" }, { status: 400 });
    }

    const category = "Aptitude(Arithmetic Aptitude,Logical Reasoning,Verbal Reasoning)";
    const difficulty = "Medium";
    const timePerQuestion = 2;
    const totalQuestions = 25;

    const resp = await axios.post(`${process.env.BASE_URL}/api/get-ai-quiz`, {
      category,
      difficulty,
      totalQuestions,
      timePerQuestion
    });

    const quizData = resp.data.quiz; // check shape before using
    console.log(`AI quiz API response:`, resp.data);

    const startDate = new Date();
    let endDate = new Date(startDate);

    if (type === "daily") endDate.setDate(endDate.getDate() + 1);
    if (type === "weekly") endDate.setDate(endDate.getDate() + 7);
    if (type === "monthly") endDate.setMonth(endDate.getMonth() + 1);

    const quiz = await Quiz.create({
      quizTitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`,
      quizDescription: `Auto-generated ${type} quiz`,
      quizTime: 50,
      quizQuestions: quizData.quizQuestions, // must match API shape
      quizCategory: "Aptitude",
      quizType: `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`,
      createdByAI: true,
      startDate,
      endDate,
      isPublish: true
    });

    console.log(`✅ ${type} quiz created at ${new Date().toISOString()}`);

    return NextResponse.json({ success: true, quiz }, { status: 201 });

  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
