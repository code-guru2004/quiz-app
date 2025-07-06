import { dbConnect } from "@/db/dbConnect";
import Preparation from "@/db/schema/PreparationSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const preparations = await Preparation.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: preparations,
    });
  } catch (error) {
    console.error("Error fetching preparations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch preparations.",
      },
      { status: 500 }
    );
  }
}
