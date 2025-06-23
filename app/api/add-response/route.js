import { dbConnect } from "@/db/dbConnect";
import Quiz from "@/db/schema/quizSchema";


export async function POST(req) {
  const { quizId, email, action } = await req.json();
  await dbConnect()
  try {
    
   
    
    const quiz = await Quiz.findById(quizId);
 
    
    if (!quiz) return new Response("Quiz not found", { status: 404 });
  
    // Remove email from both to ensure exclusive
    quiz.quizLikes = quiz.quizLikes.filter(e => e !== email);
    quiz.quizDislikes = quiz.quizDislikes.filter(e => e !== email);
  
    if (action === "like") quiz.quizLikes.push(email);
    if (action === "dislike") quiz.quizDislikes.push(email);
  
    await quiz.save();
    return Response.json({ likes: quiz.quizLikes.length, dislikes: quiz.quizDislikes.length });
  } catch (error) {
    return Response.json({ success: false,message: error });
  }
}
