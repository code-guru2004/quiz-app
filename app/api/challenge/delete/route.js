import { dbConnect } from "@/db/dbConnect";
import Challenge from "@/db/schema/Challenge";

export default async function DELETE(params) {
    try {
        await dbConnect();
        await Challenge.deleteMany({});
        
    } catch (error) {
        
    }
}