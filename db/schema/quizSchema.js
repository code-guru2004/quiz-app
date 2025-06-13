import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  id: { // renamed from 'id' to avoid confusion with _id
    type: String,
    required: true,
  },
  mainQuestion: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

const userQuizSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
  },
  score:{
    type:Number,
    default:0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const quizSchema = new mongoose.Schema({
  quizTitle: {
    type: String,
    required: true,
  },
  quizIcon: {
    type: Number, // or String depending on your use case
  },
  quizQuestions: {
    type: [quizQuestionSchema],
    required: true,
  },
  userSubmissions: {
    type: [userQuizSchema],
    default: [],
  }
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
export default Quiz;
