import { dbConnect } from '@/db/dbConnect';
import User from '@/db/schema/User';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ users: [] });
  }

  await dbConnect(); // ensure DB connection

  const regex = new RegExp(`^${term}`, 'i'); // case-insensitive, starts with

  const users = await User.find({ username: { $regex: regex } })
    .limit(10)
    .select('username email');

  return NextResponse.json({ users });
}
