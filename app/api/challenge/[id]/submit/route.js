import { dbConnect } from "@/db/dbConnect";
import Challenge from "@/db/schema/Challenge";


export async function POST(req, { params }) {
  await dbConnect();
  const challengeId = await params.id;
  const body = await req.json();
  const { username, answers, score, timeTaken } = body;

  const challenge = await Challenge.findOne({ challengeId });

  if (!challenge) {
    return new Response(JSON.stringify({ success: false, message: 'Challenge not found' }), { status: 404 });
  }

  challenge.responses.push({
    user:username,
    selectedAnswers:answers,
    score,
    timeTaken,
    submittedAt: new Date(),
  });

  await challenge.save();

  return new Response(JSON.stringify({ success: true, message: 'Response recorded' }), { status: 200 });
}
