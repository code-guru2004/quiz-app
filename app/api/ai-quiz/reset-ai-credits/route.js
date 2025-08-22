import { dbConnect } from "@/db/dbConnect";
import User from "@/db/schema/User";


// ✅ Reset function
async function resetCredits() {
  await dbConnect();
  const result = await User.updateMany({}, { $set: { aiRemainingUses: 5 } });
  return result.modifiedCount;
}

// ✅ POST handler
export async function POST() {
  try {
    const modifiedCount = await resetCredits();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily AI credits reset successfully",
        modifiedCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// ✅ GET handler (for cron jobs)
export async function GET() {
  try {
    const modifiedCount = await resetCredits();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily AI credits reset successfully (via GET)",
        modifiedCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
