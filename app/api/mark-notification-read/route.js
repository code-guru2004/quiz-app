// app/api/mark-notification-read/route.ts
import { NextResponse } from "next/server";

import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";

export async function POST(req) {
  const { id,username } = await req.json();
  console.log(id,username);
  
  try {

    await dbConnect();

    const result = await User.updateOne(
      { username, "notifications.id": id },
      { $set: { "notifications.$.read": true } }
    );

    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
