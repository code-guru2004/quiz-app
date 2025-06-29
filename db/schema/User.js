import mongoose from 'mongoose';

const quizSubmitSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    
  },
  quizTitle: {
    type: String,
    required: true,
  },
  quizIcon: {
    type: Number, // or String depending on your use case
  },
  quizScore: {
    type: Number,
    required: true,
    default:0,
  },
  quizTotalQuestions:{
    type: Number
  },
  rank: {
    type: Number
  },
  submittedAt: {
    type: Date,
    default: new Date() 
  },
  time:{
    type:Number
  },
  quizMode: {
    type: String,
    required: true, // optional but recommended to enforce it
  },
  quizCategory: { // ✅ added field
    type: String,
    required: true,
  },
  selectedAnswers: {
    type: [{
      questionId: String, // matches quizQuestionSchema.id
      selectedOption: String,
    }],
    default: [],
  },
});

// ✅ New AI Quiz Schema
const aiQuizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  score:{
    type:Number,
    required:true
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  submitQuiz: {
    type: [quizSubmitSchema],
    default:[]
  },
  aiQuizzes: {
    type: [aiQuizSchema],
    default: [],
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
