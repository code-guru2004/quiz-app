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
  avgTime:{
    type: Number, //store the avg time to answer a particular question
    default: 0,
  }
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
  },
  perQuestionTimes: {
    type: [Number], // Array of time spent per question (in seconds)
    default: [],     // One entry per question
  },
  selectedAnswers: {
    type: [{
      questionId: String, // matches quizQuestionSchema.id
      selectedOption: String,
    }],
    default: [],
  },
});


const quizSchema = new mongoose.Schema({
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
  },
  quizMode: {
    type: String,
    enum: ['Live Quiz', 'Practice Quiz'],
    default: 'Live Quiz',
    required: true, // optional but recommended to enforce it
  },
  quizCategory: { // ✅ added field
    type: String,
    required: true,
  },
  minimumTime: {
    type: Number, //track the mini time to complete the quiz
  }
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
export default Quiz;
