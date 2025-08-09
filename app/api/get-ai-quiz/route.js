import { chatSession } from "@/lib/GenAi";

export async function POST(req) {
  const { category, difficulty, totalQuestions, timePerQuestion } = await req.json();
  const totalTime = totalQuestions * timePerQuestion;
  const randomSeed = Math.random().toString(36).substring(2, 10);

  // Structured prompt as a JSON-friendly object
  const prompt = {
    role: "system",
    content: JSON.stringify({
      instruction: "Generate a unique multiple-choice quiz based on the parameters",
      parameters: {
        seed: randomSeed,
        category,
        difficulty,
        totalQuestions,
        timePerQuestion,
        totalTime
      },
      requirements: {
        quizDescription: "2-3 sentence summary of quiz content",
        questions: {
          count: totalQuestions,
          type: "multiple-choice",
          options: {
            min: 3,
            max: 5,
            randomized: true
          },
          structure: {
            id: "uuid-v4 format",
            mainQuestion: "question text",
            choices: "prefixed with A., B., etc.",
            correctAnswer: "letter of correct option",
            explanation: "brief explanation"
          }
        }
      },
      outputFormat: {
        required: "strict JSON only",
        structure: {
          quizDescription: "string",
          category: "string",
          level: "string",
          totalQuestions: "number",
          totalTime: "number",
          mcq: "array of question objects"
        }
      }
    })
  };

  try {
    // Send the stringified prompt to your AI service
    const aiResponse = await chatSession.sendMessage(JSON.stringify(prompt));
    const text = await aiResponse.response.text();
    
    // Clean and parse the response
    const jsonText = text.replace(/```json|```/g, '');
    const quizData = JSON.parse(jsonText);
    
    console.log("Generated Quiz:", quizData);

    return Response.json({
      success: true,
      message: "AI quiz generated successfully",
      quiz: quizData,
    });
  } catch (error) {
    console.error("AI Quiz Generation Error:", error);

    return Response.json({
      success: false,
      message: "Failed to generate AI quiz",
      error: error.message,
    });
  }
}