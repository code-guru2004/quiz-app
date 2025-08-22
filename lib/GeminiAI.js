// lib/GeminiAI.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateGeminiResponse(prompt) {
  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json", // force JSON output
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
    generationConfig, // 👈 added here
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
