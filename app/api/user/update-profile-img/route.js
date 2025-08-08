import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { username, profileImg } = body;
console.log(username, profileImg);

        if (!username) {
            return NextResponse.json(
                { message: "Username is not defined", success: false },
                { status: 400 }
            );
        }

        if (!profileImg) {
            return NextResponse.json(
                { message: "Profile image is not defined", success: false },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        user.profileImg = profileImg;
        await user.save();

        return NextResponse.json(
            { message: "Profile image updated successfully", success: true, profileImg },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile image:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
