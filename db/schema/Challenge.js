import mongoose from "mongoose";

// Match your quizQuestionSchema exactly
const challengeQuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  mainQuestion: {
    type: String,
    default: "",
  },
  mainQuestionImage: {
    type: String, // Cloudinary URL or public ID
    default: "",
  },
  choices: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  avgTime: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const responseSchema = new mongoose.Schema({
  user: { type: String, required: true }, // fromUser or toUser
  selectedAnswers: {
    type: [{
      questionId: String,
      selectedOption: String,
    }],
    default: [],
  },
  score: Number,
  timeTaken: Number,
  submittedAt: Date,
}, { _id: false });

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
    enum: ['pending', 'accepted', 'completed','reject'],
    default: 'pending',
  },
  questions: {
    type: [challengeQuestionSchema],
    required: true,
  },
  responses: {
    type: [responseSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  acceptedAt: Date,
});
challengeQuestionSchema.pre("validate", function (next) {
  if (!this.mainQuestion && !this.mainQuestionImage) {
    next(new Error("Either mainQuestion (text) or mainQuestionImage (image) is required."));
  } else {
    next();
  }
});
export default mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
