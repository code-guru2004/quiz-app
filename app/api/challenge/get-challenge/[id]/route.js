import { dbConnect } from "@/db/dbConnect";
import Challenge from "@/db/schema/Challenge";

export async function GET(req, context) {
  const { id } =await context.params;

  await dbConnect();

  const challenge = await Challenge.findOne({ challengeId: id });
  if (!challenge) {
    return new Response(
      JSON.stringify({ success: false, message: "Challenge not found" }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify({ success: true, challenge }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

