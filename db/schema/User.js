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
  quizType: {
    type: String,
    required: true, 
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

// ⚠️ Notification Schema
const notificationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true, // UUID (generate on creation)
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String, // optional, e.g. /quiz/123
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});
const FriendSchema = new mongoose.Schema({
  username:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true
  }
}) 
const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  profileImg:{
    type: String,
    default: "https://res.cloudinary.com/dlvbaulyy/image/upload/v1754649008/abo7ucf6qo0xx28r0oqy.jpg"
  },
  password: { 
    type: String, 
    required: true 
  },
  submitQuiz: {
    type: [quizSubmitSchema],
    default:[]
  },
  aiQuizzes: {
    type: [aiQuizSchema],
    default: [],
  },
  notifications: {
    type: [notificationSchema],
    default: []
  },
  friendList:{
    type: [FriendSchema],
    default: []
  },
  dailyStreak: { type: Number, default: 0 },        
  lastDailyQuizDate: { type: Date, default: null },
  createdAt:{
    type: Date,
    default: Date.now()
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
