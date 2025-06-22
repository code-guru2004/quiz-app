import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";


export async function PATCH(request) {
  await dbConnect();

  try {
    const { quizId, email, rank } = await request.json();

    if (!quizId || !email || typeof rank !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find the quiz submission and update rank
    const submission = user.submitQuiz.find((s) => s.quizId === quizId);
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Quiz submission not found for this user" },
        { status: 404 }
      );
    }

    submission.rank = rank;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Rank updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating rank:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
