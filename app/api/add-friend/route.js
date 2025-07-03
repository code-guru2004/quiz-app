import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    try {
        const { username, friend } = await req.json();
        console.log(username);

        console.log(friend);
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 400 });
        } else {
            const { friendUsername, email } = friend;
            const isAlreadyFriend = user.friendList.some((friend) => friend.username === friendUsername);
            if (isAlreadyFriend) {
                return NextResponse.json({
                    success: false,
                    message: "Already Friend"
                }, { status: 400 });
            }
            user.friendList.push({
                username: friendUsername,
                email
            });
            await user.save();
            return NextResponse.json({
                success: true,
                message: "Add to frind zone successfully"
            },{status:200});
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Database error"
        }, { status: 400 });
    }
}