import { dbConnect } from "@/db/dbConnect";
import Preparation from "@/db/schema/PreparationSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const { id } = await req.json();
        console.log("Deleting topic with ID:", id);

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "ID not provided",
            }, { status: 400 });
        }

        await Preparation.findByIdAndDelete(id);
        const updatedPreparations = await Preparation.find();

        return NextResponse.json({
            success: true,
            data: updatedPreparations,
        });
    } catch (error) {
        console.error("Error deleting topic:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 });
    }
}
