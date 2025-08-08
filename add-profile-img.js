import 'dotenv/config'; // ES modules way
// OR
// import dotenv from 'dotenv';
// dotenv.config();

import mongoose from "mongoose";
import User from "./db/schema/User.js";
import { dbConnect } from "./db/dbConnect.js";

await dbConnect();

const res = await User.updateMany(
  { $or: [ { profileImg: { $exists: false } }, { profileImg: null }, { profileImg: "" } ] },
  { $set: { profileImg: "https://res.cloudinary.com/dlvbaulyy/image/upload/v1754649008/abo7ucf6qo0xx28r0oqy.jpg" } }
);

console.log(`${res.modifiedCount} users updated`);
await mongoose.disconnect();
