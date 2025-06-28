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
})
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
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
