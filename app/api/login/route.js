import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


import { dbConnect } from '@/db/dbConnect';
import User from '@/db/schema/User';

export async function POST(req) {
  const { email, password } = await req.json();

  await dbConnect;
  const user = await User.findOne({ email });
  //console.log("user",user);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
//console.log("token",token);

  return NextResponse.json({ token });
}
