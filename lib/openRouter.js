export async function generateOpenRouterResponse(prompt) {
    const model = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct:free";
  
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
  
        // Optional but recommended by OpenRouter
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "X-Title": "AI Quiz App"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful quiz generator." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9
      })
    });
  
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter Error: ${res.status} - ${errText}`);
    }
  
    return await res.json();
  }
  