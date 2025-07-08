import { NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';
import { dbConnect } from '@/db/dbConnect';
import User from '@/db/schema/User';
import Challenge from '@/db/schema/Challenge';
import { chatSession } from '@/lib/GenAi';

export async function POST(req) {
  try {
    await dbConnect();

    const { sender, opponent,challengeId } = await req.json();
console.log(sender, opponent,challengeId);


    if (!sender || !opponent) {
      return NextResponse.json({ success: false, message: 'Missing sender or opponent' }, { status: 400 });
    }

    // Find the opponent user
    const opponentUser = await User.findOne({ username: opponent });
    //console.log(opponentUser);

    if (!opponentUser) {
      return NextResponse.json({ success: false, message: 'Opponent not found' }, { status: 404 });
    }
    
    // Prepare new notification
    const newNotification = {
      id: uuidv4(),
      title: "New 1 v/s 1 Challenge!",
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
