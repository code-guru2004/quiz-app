import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const contestLevel = ["Medium", "Hard","Very Hard"];
    const allDescription = {
      daily: "Short, fast-paced quizzes refreshed daily to keep you sharp and consistent.",
      weekly: "Weekly competitive challenges combining skill and strategy for mid-term leaderboard positions.",
      monthly: "Long-form monthly tournaments featuring diverse topics, rewarding persistence and mastery."
    }
    
    
    const contestData = {
      daily: { noOfQuestions: 15, time: 30, perQuestionTime: 2, level: contestLevel[Math.floor(Math.random() * contestLevel.length)] },
      weekly: { noOfQuestions: 20, time: 40, perQuestionTime: 2, level: contestLevel[Math.floor(Math.random() * contestLevel.length)] },
      monthly: { noOfQuestions: 25, time: 50, perQuestionTime: 2, level: contestLevel[Math.floor(Math.random() * contestLevel.length)] },
    };

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return NextResponse.json({ error: "Invalid quiz type" }, { status: 400 });
    }

    // Prevent duplicate quizzes for the same period
    const startDate = new Date();
    let endDate = new Date(startDate);
    if (type === "daily") endDate.setDate(endDate.getDate() + 1);
    if (type === "weekly") endDate.setDate(endDate.getDate() + 7);
    if (type === "monthly") endDate.setMonth(endDate.getMonth() + 1);

    const existing = await Quiz.findOne({
      quizType: `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`,
      startDate: { $lte: startDate },
      endDate: { $gte: startDate }
    });
    if (existing) {
      return NextResponse.json({ error: `${type} quiz already exists` }, { status: 400 });
    }

    // Generate AI quiz
    const category = "Aptitude(Arithmetic Aptitude, Logical Reasoning, Verbal Reasoning)";
    const resp = await axios.post(`${process.env.BASE_URL}/api/get-ai-quiz`, {
      category,
      difficulty: contestData[type].level,
      totalQuestions: contestData[type].noOfQuestions,
      timePerQuestion: contestData[type].perQuestionTime,
    });

    const quizData = resp.data.quiz;
    if (!quizData?.quizQuestions?.length) {
      return NextResponse.json({ error: "No quiz questions returned" }, { status: 500 });
    }

    const quiz = await Quiz.create({
      quizTitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Contest`,
      quizDescription: allDescription[type],
      quizIcon:20,
      quizTime: contestData[type].time,
      quizQuestions: quizData.quizQuestions,
      quizCategory: "Aptitude",
      quizType: `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`,
      createdByAI: true,
      startDate,
      endDate,
      isPublish: true,
    });

    console.log(`✅ Generated ${type} quiz (${contestData[type].level}, ${contestData[type].noOfQuestions} Qs) at ${new Date().toISOString()}`);
    return NextResponse.json({ success: true, quiz }, { status: 201 });

  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
