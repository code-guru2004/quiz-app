import { dbConnect } from "@/db/dbConnect";
import Preparation from "@/db/schema/PreparationSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, links } = await req.json();
    await dbConnect();

    if (!topic || topic.trim() === "" || !links || links.length === 0) {
      return NextResponse.json(
        { success: false, message: "Topic and links are required." },
        { status: 400 }
      );
    }

    const existingTopic = await Preparation.findOne({ topic });

    if (existingTopic) {
      // ✅ Append new links (filter out duplicates if needed)
      existingTopic.links.push(...links);
      await existingTopic.save();

      return NextResponse.json({
        success: true,
        message: "Links appended to existing topic.",
        data: existingTopic,
      });
    } else {
      // ✅ Create new document
      const prep = new Preparation({ topic, links });
      await prep.save();

      return NextResponse.json({
        success: true,
        message: "New preparation topic added.",
        data: prep,
      });
    }
  } catch (error) {
    console.error("Error in preparation POST:", error);
    return NextResponse.json(
      { success: false, message: "Server error while adding preparation." },
      { status: 500 }
    );
  }
}
