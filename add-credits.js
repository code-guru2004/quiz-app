import "dotenv/config";
import mongoose from "mongoose";
import User from "./db/schema/User.js"; // adjust path if needed

async function updateUsers() {
  try {
    
    

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected to MongoDB");
    const res = await User.updateMany(
      {
        $or: [
          { aiRemainingUses: { $exists: false } },
          { aiRemainingUses: null },
          { aiRemainingUses: "" },
        ],
      },
      { $set: { aiRemainingUses: 5 } }
    );

    console.log(`✅ ${res.modifiedCount} users updated`);
   
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

updateUsers();
