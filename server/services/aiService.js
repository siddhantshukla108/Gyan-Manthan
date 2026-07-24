const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const models = [
  'poolside/laguna-s-2.1:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free'
];

/**
 * Robust JSON parser that handles markdown code blocks and generic text wrapping
 */
function extractJSON(text) {
  try {
    // 1. Try direct parsing
    return JSON.parse(text);
  } catch (e) {
    // 2. Try removing markdown blocks e.g., ```json\n...\n```
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {}
    }
    // 3. Fallback regex to find first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const jsonStr = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonStr);
      } catch (err) {}
    }
    throw new Error('Could not parse JSON from LLM response: ' + text);
  }
}

/**
 * Execute chat completion with model fallback mechanism
 */
async function generateCompletion(prompt, maxTokens = 3000) {
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY is missing in env');

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173', 
            'X-Title': 'Gyan-Manthan'
          },
          timeout: 30000 // 30 sec timeout
        }
      );

      const content = response.data.choices[0].message.content;
      return extractJSON(content);
    } catch (error) {
      console.warn(`Model ${model} failed:`, error?.response?.data || error.message);
      lastError = error;
      // Continue to next model in loop
    }
  }

  throw new Error('All AI models failed. Last error: ' + (lastError?.message || 'Unknown error'));
}

exports.generateReadingPlan = async (book, options) => {
  const { durationDays, readingMode, language } = options;
  
  const prompt = `You are Gyan Manthan AI. Create a ${durationDays}-day reading plan for "${book.title}" by "${book.author}".
Mode: "${readingMode}". Output language: "${language}".
IMPORTANT: Write text in the native script of ${language}. Do NOT use English script for non-English languages. Keep sentences very concise to save tokens.
Escape quotes inside string values.

Please respond ONLY in valid JSON format. The root object MUST contain a key "sessions" which is an array of exactly ${durationDays} session objects.
Format:
{
  "sessions": [
    {
      "dayNumber": 1,
      "content": "What to read today",
      "summary": "Summary in ${language}",
      "keyIdea": "Core idea in ${language}",
      "metaphor": "Metaphor analysis in ${language}",
      "implementationTask": "Actionable step in ${language}",
      "reflectionQuestion": "Reflection question in ${language}"
    }
  ]
}`;

  return await generateCompletion(prompt, 3000);
};

exports.analyzeHighlight = async (text, language) => {
  const prompt = `You are an expert literary analyst and multilingual tutor. 
Analyze the following highlighted text from a book: "${text}".

Please provide a JSON response with the following structure:
{
  "aiExplanation": (String: Deep meaning and context of this text explained clearly in ${language}),
  "metaphorType": (String: Identify any metaphor, literary device, or emotional tone used, explained in ${language}),
  "practicalApplication": (String: How can the reader apply this specific quote to real life? in ${language})
}
Ensure valid JSON output. Escape quotes inside string values.`;

  return await generateCompletion(prompt, 1500);
};
