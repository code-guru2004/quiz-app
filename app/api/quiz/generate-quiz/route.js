import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";
import User from "@/db/schema/User";
import { transporter } from "@/lib/nodemailer";
import axios from "axios";
import { NextResponse } from "next/server";

const sendContestNotification = async (type,totalQuestions,totalTime,level) => {
  try {
    const users = await User.find({}, "email");
    const emails = users.map(u => u.email);

    const joinLink = `https://eduprobe-exam.vercel.app/contest/${type}`;
    const html = `
      <h2>New ${type} Contest!</h2>
      <ul>
        <li>Questions: ${totalQuestions}</li>
        <li>Time: ${totalTime} min</li>
        <li>Difficulty: ${level}</li>
      </ul>
      <a href="${joinLink}" style="padding: 10px 15px; background: #1d4ed8; color: #fff; text-decoration: none; border-radius: 5px;">Join Contest</a>
    `;

    await transporter.sendMail({
      from: `"EduProbe" <${process.env.SMTP_USER}>`,
      bcc: emails.join(","),
      subject: `New ${type} Contest Available!`,
      html,
    });

    console.log(`✅ Sent contest notification to ${emails.length} users`);
  } catch (err) {
    console.error("❌ Failed to send contest notification:", err);
  }
};

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const contestLevel = ["Medium", "Hard", "Very Hard"];
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
    // Always normalize startDate to the start of the day
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0); // Today at 00:00:00 UTC

    let endDate = new Date(startDate);

    if (type === "daily") {
      endDate.setUTCHours(23, 59, 59, 999); // Today at 23:59:59.999 UTC
    }
    if (type === "weekly") {
      endDate.setUTCDate(endDate.getUTCDate() + 6); // add 6 days ahead
      endDate.setUTCHours(23, 59, 59, 999);        // end of that day
    }
    if (type === "monthly") {
      endDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
    }
    

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
      quizIcon: 20,
      quizTime: contestData[type].time,
      quizQuestions: quizData.quizQuestions,
      quizCategory: "Aptitude",
      quizType: `${type.charAt(0).toUpperCase() + type.slice(1)} Quiz`,
      createdByAI: true,
      startDate,
      endDate,
      isPublish: true,
    });

    // send mail to all users
    await sendContestNotification(
      type, 
      contestData[type].noOfQuestions, 
      contestData[type].time, 
      contestData[type].level
    );

    console.log(`✅ Generated ${type} quiz (${contestData[type].level}, ${contestData[type].noOfQuestions} Qs) at ${new Date().toISOString()}`);
    return NextResponse.json({ success: true, quiz }, { status: 201 });

  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
