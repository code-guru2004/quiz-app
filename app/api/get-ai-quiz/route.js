import { chatSession } from "@/lib/GenAi";

export async function POST(req) {
  const { category, difficulty, totalQuestions, timePerQuestion } = await req.json();

  const totalTime = totalQuestions * timePerQuestion;

  const randomSeed = Math.random().toString(36).substring(2, 10); // adds randomness to prompt

const prompt = `
You are an intelligent quiz generator bot. Based on the following input parameters, generate a unique and diverse multiple-choice quiz. Always provide different questions, even if the input is repeated.

### Seed: ${randomSeed}
This seed ensures that even repeated requests with the same parameters generate new and different questions.

### Input Parameters:
- Category: ${category}
- Difficulty Level: ${difficulty}
- Total Questions: ${totalQuestions}
- Time Per Question (in minutes): ${timePerQuestion}

---

### Your Task:
1. Write a **brief quizDescription** summarizing what the quiz covers in 2–3 sentences.
2. Calculate and return **totalTime** as \`totalQuestions * timePerQuestion\` (in minutes).
3. Generate an **array of multiple-choice questions** (\`mcq\`) with this structure:
4. Vary difficulty, phrasing, and use-case examples. No repeating previous structure or options.
5. You can provide 3 to 5 choices per question.
6. Randomize the order of options for each question.
7. Also provide a brief explanation
Use this format:
\`\`\`json
{
  "id": "uuid-v4",
  "mainQuestion": "The actual question text?",
  "choices": ["A. Option 1", "B. Option 2", "C. Option 3"],
  "correctAnswer": "B",
  'explanation': ""
}
\`\`\`

### Final Output Format (JSON only):
\`\`\`json
{
  "quizDescription": "A short overview of what this quiz is about.",
  "category": "${category}",
  "level": "${difficulty}",
  "totalQuestions": ${totalQuestions},
  "totalTime": ${totalTime},
  "quizQuestions": [ /* array of questions */ ]
}
\`\`\`

Return only valid JSON. Do not include markdown or any explanation text.
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
