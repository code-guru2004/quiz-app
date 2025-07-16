import { dbConnect } from "@/db/dbConnect";
import Challenge from "@/db/schema/Challenge";

export async function PATCH(req) {
  try {
    await dbConnect();
    const { challengeId } = await req.json();

    if (!challengeId) {
      return new Response(JSON.stringify({ success: false, message: "Challenge ID is required" }), {
        status: 400,
      });
    }

    const challenge = await Challenge.findOne({ challengeId });

    if (!challenge) {
      return new Response(JSON.stringify({ success: false, message: "Challenge not found" }), {
        status: 404,
      });
    }

    challenge.status = "accepted";
    challenge.acceptedAt = new Date();
    await challenge.save();

    return new Response(JSON.stringify({ success: true, message: "Challenge accepted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error accepting challenge:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
    });
  }
}
