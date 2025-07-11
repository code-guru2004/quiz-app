import { dbConnect } from '@/db/dbConnect';
import User from '@/db/schema/User';

import bcrypt from 'bcryptjs';

export async function POST(req) {
  const {username, email, password } = await req.json();
  console.log(username, email, password);
  
  await dbConnect();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return Response.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({username, email, password: hashedPassword });

  return Response.json({ message: 'User created', userId: newUser._id });
}
