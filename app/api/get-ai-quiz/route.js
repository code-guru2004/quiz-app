import { chatSession } from "@/lib/GenAi";

export async function POST(req) {
  const { category, difficulty, totalQuestions, timePerQuestion } = await req.json();

  const totalTime = totalQuestions * timePerQuestion;

  const prompt = `
You are an intelligent quiz generator bot. Based on the following input parameters, generate a complete quiz with multiple-choice questions.Always give different different questions.

### Input Parameters:
- Category: ${category}
- Difficulty Level: ${difficulty} 
- Total Questions: ${totalQuestions}
- Time Per Question (in minutes): ${timePerQuestion}

---

### Your Task:
1. Write a **brief quizDescription** summarizing what the quiz covers in 2-3 sentences.
2. Calculate and return **totalTime** as \`totalQuestions * timePerQuestion\` (in minutes).
3. Generate an **array of multiple-choice questions** (\`mcq\`) with this structure:
4. You can provide 3 to 5 choices(options).
\`\`\`json
{
  "id": "uuid-v4", 
  "mainQuestion": "The actual question text?",
  "choices": ["A. Option 1", "B. Option 2", "C. Option 3"],
  "correctAnswer": "B"
}
\`\`\`

### Final Output Format:
\`\`\`json
{
  "quizDescription": "A short overview of what this quiz is about.",
  "category": "${category}",
  "level": "${difficulty}",
  "totalQuestions": ${totalQuestions},
  "totalTime": ${totalTime},
  "mcq": [ /* array of questions */ ]
}
\`\`\`

Return valid JSON only. No explanations or markdown formatting.
`;

  try {
    const aiResponse = await chatSession.sendMessage(prompt);
    const text = await aiResponse.response.text();
    const jsonText = text.replace(/```json|```/g, '');
    const quizData = JSON.parse(jsonText);

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
