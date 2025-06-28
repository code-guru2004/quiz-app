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
  username:{
    type: String,
    required: true
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


const practiceQuizSchema = new mongoose.Schema({
  quizTitle: {
    type: String,
    required: true,
  },
  quizIcon: {
    type: Number, // or String depending on your use case
  },
  quizDescription:{
    type : String,
    required: true
  },
  quizTime:{
    type: Number, 
    required: true,
    default: 10, // default 10 Minutes 
  },
  quizQuestions: {
    type: [quizQuestionSchema],
    required: true,
  },
  userSubmissions: {
    type: [userQuizSchema],
    default: [],
  },
  quizLikes: {
    type: [String], // array of user emails or user IDs
    default: [],
  },
  quizDislikes: {
    type: [String],
    default: [],
  }
});

const PracticeQuiz = mongoose.models.PracticeQuiz || mongoose.model('PracticeQuiz', practiceQuizSchema);
export default PracticeQuiz;
