import { dbConnect } from '@/db/dbConnect';
import Challenge from '@/db/schema/Challenge';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('user');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const skip = (page - 1) * limit;

  if (!username) {
    return NextResponse.json(
      { success: false, message: 'Missing user' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const [challenges, total] = await Promise.all([
      Challenge.find({
        $or: [{ fromUser: username }, { toUser: username }],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Challenge.countDocuments({
        $or: [{ fromUser: username }, { toUser: username }],
      }),
    ]);

    return NextResponse.json({ success: true, challenges, total });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
