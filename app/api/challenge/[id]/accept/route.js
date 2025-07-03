import { dbConnect } from "@/db/dbConnect";
import Challenge from "@/db/schema/Challenge";


export async function POST(req, { params }) {
  await dbConnect();

  const challenge = await Challenge.findOne({ challengeId: params.id });

  if (!challenge) {
    return new Response(JSON.stringify({ success: false, message: 'Challenge not found' }), { status: 404 });
  }

  challenge.status = 'accepted';
  challenge.acceptedAt = new Date();

  await challenge.save();

  return new Response(JSON.stringify({ success: true, message: 'Challenge accepted' }), { status: 200 });
}
