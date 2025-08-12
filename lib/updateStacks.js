import 'dotenv/config'; 
import mongoose from "mongoose";
import User from "../db/schema/User.js";
const MONGO_URI = "mongodb+srv://nayanhetc61:nayan@cluster0.kxhyzvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function updateUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Update all users who don't have these fields yet
    const result = await User.updateMany(
      {
        $or: [
          { dailyStreak: { $exists: false } },
          { lastDailyQuizDate: { $exists: false } }
        ]
      },
      {
        $set: {
          dailyStreak: 0,
          lastDailyQuizDate: null
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
}

updateUsers();
