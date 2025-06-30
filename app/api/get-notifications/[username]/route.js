import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function GET(params, context) {
    await dbConnect();
    try {
        const { params } = await context;
        const { username } = await params;
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Username is not found" },
                { status: 400 }
            );
        }

        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json(
                { success: false, message: "User is not found" },
                { status: 400 }
            );
        }

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error in finding user" },
            { status: 400 }
        );
    }
}