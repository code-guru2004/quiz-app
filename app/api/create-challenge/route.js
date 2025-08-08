import { dbConnect } from '@/db/dbConnect';
import Challenge from '@/db/schema/Challenge';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { sender, opponent, questions,testTopic } = body;

    if (!sender || !opponent || !questions || !Array.isArray(questions) || !testTopic) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    const challengeId = uuidv4();

    const newChallenge = new Challenge({
      challengeId,
      fromUser: sender,
      toUser: opponent,
      topic: testTopic,
      questions,
    });

    await newChallenge.save();

    // Convert to plain object (optional, but safe for API)
    const challengeData = newChallenge.toObject();
    delete challengeData.__v; // optional cleanup

    return NextResponse.json(
      {
        success: true,
        challengeId,
        newChallenge: challengeData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
