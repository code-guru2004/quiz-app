import { dbConnect } from "@/db/dbConnect";
import Challenge from "@/db/schema/Challenge";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await dbConnect();
        const { challengeId } = await req.json();

        if (!challengeId) {
            return NextResponse.json({
                message: "Challenge ID is required",
                success: false,
            }, {
                status: 400,
            });
        }

        const challenge = await Challenge.findOne({ challengeId });

        if (!challenge) {
            return NextResponse.json({
                message: "Challenge not found",
                success: false,
            }, {
                status: 404,
            });
        }

        challenge.status = "reject";
        await challenge.save();

        return NextResponse.json({
            message: "Challenge rejected successfully",
            success: true,
        }, {
            status: 200,
        });
    } catch (error) {
        console.error("Error rejecting challenge:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false,
        }, {
            status: 500,
        });
    }
}
