import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    try {
        const username = request.nextUrl.searchParams.get("username");
        //console.log(email);
        
        if (!username) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, message: "You have already attend the quiz", userData : user },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Missing required fields" },
            { status: 400 }
        );
    }
}