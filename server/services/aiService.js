const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const models = [
  'openai/gpt-oss-20b:free', // 20B params, perfect balance of speed and intelligence
  'nvidia/nemotron-nano-9b-v2:free', // 9B params, extremely fast backup
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', // 30B params
  'poolside/laguna-s-2.1:free', // Backup
  'google/gemma-4-26b-a4b-it:free', // Backup
  'google/gemma-4-31b-it:free' // Slower backup
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
async function generateCompletion(prompt, maxTokens = 3000, forceJson = true) {
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY is missing in env');

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      
      const payload = {
        model: model,
        messages: [{ role: 'user', content: prompt }]
      };
      
      if (forceJson) {
        payload.response_format = { type: 'json_object' };
      }

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173', 
            'X-Title': 'Gyan-Manthan'
          },
          timeout: 45000 // 45 sec timeout to allow for longer generations
        }
      );

      const content = response.data.choices[0].message.content;
      return forceJson ? extractJSON(content) : content;
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
  
  const prompt = `You are Gyan Manthan AI, an expert syllabus creator. Create a ${durationDays}-day reading plan for the book "${book.title}" by "${book.author}".
Mode: "${readingMode}". Output language: "${language}".

STRICT PACING RULES based on duration (${durationDays} days):
- If 7 days: Group massive chunks of the book (e.g. 3-5 chapters) per day. Move very fast.
- If 15 days: Group moderate chunks (1-2 chapters) per day.
- If 30 days: Micro-chunks. Assign only a few pages, a single subchapter, or one core concept per day.

STRICT FOCUS RULES based on mode ("${readingMode}"):
- If "Fast": Focus on high-level plot/concepts. Make 'summary' and 'keyIdea' extremely brief and actionable.
- If "Deep Study" or "Study": Focus on deep philosophical themes, metaphors, and historical context. Make 'metaphor' and 'reflectionQuestion' profound.

IMPORTANT: Write all textual output in the native script of ${language}. Do NOT use English script for non-English languages. Keep sentences very concise to save tokens.
Escape quotes inside string values.

Please respond ONLY in valid JSON format. The root object MUST contain a key "sessions" which is an array of exactly ${durationDays} session objects.
Format:
{
  "sessions": [
    {
      "dayNumber": 1,
      "content": "Specific chapters/pages to read today",
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

  return await generateCompletion(prompt, 1500, true);
};

exports.generateReadingNotes = async (bookTitle, bookAuthor, language, sessionContent, readingMode) => {
  const prompt = `You are an expert scholar and tutor. A user is studying the book "${bookTitle}" by ${bookAuthor}.
Today's reading assignment is: "${sessionContent}".
The user's chosen reading mode is: "${readingMode}".

Please generate a highly detailed, comprehensive set of reading notes for this specific assignment.
IMPORTANT RULES:
1. MUST be written entirely in ${language}.
2. MUST use Markdown formatting (headings, bullet points, bold text).
3. Do NOT output JSON. Just output the Markdown text directly.

STRICT CONTENT RULES based on mode ("${readingMode}"):
- If "Fast": Generate snappy, highly scannable bullet points. Focus purely on executive summaries and actionable takeaways. Skip heavy philosophical tangents.
- If "Deep Study" or "Study": Generate long-form, essay-style notes. Dive deep into literary devices, historical context, underlying philosophy, and profound analysis of the text. Provide a rich intellectual experience.`;

  return await generateCompletion(prompt, 4000, false);
};
