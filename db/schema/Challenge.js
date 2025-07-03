import mongoose from "mongoose";

// Define a sub-schema for each question
const questionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
  },
  correctOption: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true,
  },
}, { _id: false });

// Define the main challenge schema
const challengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true,
  },
  fromUser: {
    type: String,
    required: true,
  },
  toUser: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  responses: {
    type: [
      {
        user: String, // fromUser or toUser
        selectedAnswers: [
          {
            questionId: String,
            selectedOption: String,
          },
        ],
        score: Number,
        timeTaken: Number,
        submittedAt: Date,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  acceptedAt: Date,
});

export default mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
