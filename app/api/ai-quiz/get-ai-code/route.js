import { chatSession } from "@/lib/GenAi";


export async function POST(req) {
  const { topic, difficulty, totalQuestions, timePerQuestion, languageGuess } = await req.json();

  const totalTime = totalQuestions * timePerQuestion;
  const randomSeed = Math.random().toString(36).substring(2, 10); // adds randomness to prompt

  // ✅ Check if topic is provided
  const topicLine = topic && topic.trim() !== "" 
    ? `- Topic: ${topic}\n` 
    : `- Topic: (none, generate diverse/random questions within ${languageGuess})\n`;

  const prompt = `
You are an intelligent quiz generator bot. Based on the following input parameters, generate a unique and diverse multiple-choice quiz. Always provide different questions, even if the input is repeated.

### Seed: ${randomSeed}
This seed ensures that even repeated requests with the same parameters generate new and different questions.

### Input Parameters:
${topicLine}- Programming Language: ${languageGuess}
- Difficulty Level: ${difficulty}
- Total Questions: ${totalQuestions}
- Time Per Question (in minutes): ${timePerQuestion}

---

### Critical HTML Requirement for Questions:
- For EVERY question, set **mainQuestion** as an HTML string that includes a code snippet wrapped like:
  <div class="question">
    <p>Question text here…</p>
    <pre><code class="language-${languageGuess}">CODE HERE</code></pre>
  </div>
- Choose ${languageGuess} from: js, ts, python, java, cpp, csharp, go, ruby, php, kotlin, swift, sql, html, css.
- The code must be valid, minimal, and directly relevant to the question (output prediction, bug identification, complexity, behavior, etc.).
- Do NOT use Markdown backticks anywhere. Use raw HTML in mainQuestion.
- Preserve indentation/newlines in the code by embedding them directly in the HTML; JSON-escape as needed (e.g., \\n).
- 🚫 Absolutely **no comments** in the code (no //, /* */, #, or <!-- -->). The code must only contain pure logic or expressions.
- Avoid generic concept questions (like "Which DS is LIFO?").
- Avoid giving code in options of question.

### Your Task:
1. Write a brief quizDescription summarizing what the quiz covers in 2–3 sentences.
2. Calculate and return totalTime as totalQuestions * timePerQuestion (in minutes).
3. Generate an array of multiple-choice questions (quizQuestions) with this structure:
   {
     "id": "uuid-v4",
     "mainQuestion": "<div>...<pre><code class=\\"language-xxx\\">...</code></pre></div>",
     "choices": ["A. …", "B. …", "C. …"],
     "correctAnswer": "B",
     "explanation": "Clear, step-by-step reasoning tied to the code."
   }
4. Vary difficulty, phrasing, and use-case examples. No repeating previous structure or options.
5. Provide 3 to 5 choices per question.
6. Randomize the order of options for each question. Ensure exactly one correct answer.
7. Always provide a clear and detailed explanation. If the content contains mathematical terms or equations, break it into multiple steps.
8. Ensure that all questions, answers, and explanations are accurate. Do not provide any incorrect information.
9. If topic is general (not language-specific), vary languages across questions and reflect the language in the class attribute (e.g., language-python, language-js).
10. Avoid unsafe or environment-specific operations in code (no file/network/OS writes). Keep snippets concise.

### Output Field Rules:
- id: UUID v4 format.
- mainQuestion: HTML string including the code snippet as specified.
- choices: Plain text options (you may include inline <code> for short tokens if needed, but no <pre>).
- correctAnswer: One of "A", "B", "C", "D", or "E".
- explanation: Short, accurate, step-by-step explanation referencing the code.

### Final Output Format (JSON only):
{
  "quizDescription": "A short overview of what this quiz is about.",
  "Topic": "${topic || "Random"}",
  "level": "${difficulty}",
  "totalQuestions": ${totalQuestions},
  "totalTime": ${totalTime},
  "quizQuestions": [ /* array of questions as specified */ ]
}

Return only valid JSON. Do not include markdown or any explanation text outside the JSON.
`;
console.log(prompt);

  try {
    const aiResponse = await chatSession.sendMessage(prompt);
    const text = await aiResponse.response.text();

    // clean JSON if wrapped in ```json ... ```
    const jsonText = text.replace(/```json|```/g, "");
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

// Postman testing

// {
//   "topic": "JavaScript",
//   "difficulty": "Medium",
//   "totalQuestions": 3,
//   "timePerQuestion": 2,
//   "languageGuess": "js"
// }
