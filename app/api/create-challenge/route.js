import { dbConnect } from '@/db/dbConnect';
import Challenge from '@/db/schema/Challenge';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';


export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { sender, opponent, questions } = body;

    if (!sender || !opponent || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ success: false, message: 'Missing or invalid fields' }, { status: 400 });
    }

    const challengeId = uuidv4(); // generate unique challenge ID

    const newChallenge = new Challenge({
      challengeId,
      fromUser: sender,
      toUser: opponent,
      questions, // must match quizQuestionSchema
    });

    await newChallenge.save();

    return NextResponse.json({ success: true, challengeId }, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
