import { NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';
import { dbConnect } from '@/db/dbConnect';
import User from '@/db/schema/User';
import Challenge from '@/db/schema/Challenge';
import { chatSession } from '@/lib/GenAi';

export async function POST(req) {
  try {
    await dbConnect();

    const { sender, opponent } = await req.json();


    if (!sender || !opponent) {
      return NextResponse.json({ success: false, message: 'Missing sender or opponent' }, { status: 400 });
    }

    // Find the opponent user
    const opponentUser = await User.findOne({ username: opponent });
    //console.log(opponentUser);

    if (!opponentUser) {
      return NextResponse.json({ success: false, message: 'Opponent not found' }, { status: 404 });
    }
    const prompt = `
Generate a challenge quiz with the following parameters:

- Category: JavaScript  
- Difficulty Level: medium  
- Total Questions: 5  
- Total Time: 300 seconds  

Each question should strictly follow this structure:

{
  "questionId": "string (unique ID like 'q1', 'q2', etc.)",
  "question": "string (the question text)",
  "options": {
    "A": "string (option A)",
    "B": "string (option B)",
    "C": "string (option C)",
    "D": "string (option D)"
  },
  "correctOption": "string (must be 'A', 'B', 'C', or 'D')"
}

⚠️ Output a **valid JSON array of exactly 5 questions** matching the schema above. No extra explanations or fields should be added.
`;

    const aiResponse = await chatSession.sendMessage(prompt);
    const text = await aiResponse.response.text();
    const jsonText = text.replace(/```json|```/g, '');
    const questions = JSON.parse(jsonText);

    // const questions = [
    //   {
    //     id: uuidv4(),
    //     question: 'What is 2 + 2?',
    //     options: ['3', '4', '5', '6'],
    //     correctAnswer: '4',
    //   },
    //   {
    //     id: uuidv4(),
    //     question: 'Capital of France?',
    //     options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    //     correctAnswer: 'Paris',
    //   },
    // ];

    const challengeId = uuidv4();
    await Challenge.create({
      challengeId,
      fromUser: sender,
      toUser: opponent,
      questions,
    });

    // opponentUser.notifications = opponentUser.notifications.filter(n => n.title && n.message);

    // Prepare new notification
    const newNotification = {
      id: uuidv4(),
      title: `New 1 v/s 1 Challenge!`,
      message: `${sender} has challenged you to a quiz duel!`,
      link: `/dashboard/Challenge/${challengeId}`, // page to accept and play challenge
      read: false,
      createdAt: new Date()
    };

    opponentUser.notifications.push(newNotification);

    // Save updated user
    await opponentUser.save();

    return NextResponse.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
