import mongoose from "mongoose";
import Quiz from "./db/schema/quizSchema.js";


//const MONGO_URI = process.env.MONGO_URI;

async function run() {
  try {
    // await mongoose.connect("mongodb+srv://nayanhetc");
    console.log("MongoDB connected");

    const result = await Quiz.updateMany(
      { calculatorAllowed: { $exists: false } },
      { $set: { calculatorAllowed: false } }
    );

    console.log("Update done!");
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
