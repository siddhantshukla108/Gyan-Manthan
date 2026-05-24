const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const Book = require('../models/Book');
const ReadingPlan = require('../models/ReadingPlan');
const Session = require('../models/Session');
const { verifyToken } = require('../middleware/auth');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Rate limiter for AI generation (5 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many AI requests. Please wait a minute before generating another plan.' }
});

// Sanitize user input before injecting into LLM prompts
function sanitizeForPrompt(str) {
  if (typeof str !== 'string') return '';
  // Remove control characters but keep all printable Unicode (for multi-language support)
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 1000);
}

// @route   POST /api/plans/generate
// @desc    Generate a new reading plan using AI
// @access  Private
router.post('/generate', verifyToken, aiLimiter, async (req, res) => {
  try {
    const { bookId, durationDays, readingMode, language } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Ensure user is attached from verifyToken
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    // Sanitize inputs for the prompt
    const safeTitle = sanitizeForPrompt(book.title);
    const safeAuthor = sanitizeForPrompt(book.author);
    const safeMode = sanitizeForPrompt(readingMode);
    const safeLang = sanitizeForPrompt(language);
    const safeDays = Math.min(Math.max(parseInt(durationDays) || 7, 1), 30);

    // Prompt for AI
    const prompt = `You are Gyan Manthan AI. Create a ${safeDays}-day reading plan for "${safeTitle}" by ${safeAuthor}.
Mode: "${safeMode}". Output language: "${safeLang}".
IMPORTANT: Write text in the native script of ${safeLang}. Do NOT use English script for non-English languages. Keep sentences very concise to save tokens.
Escape quotes inside string values.

Please respond ONLY in valid JSON format. The root object MUST contain a key "sessions" which is an array of exactly ${safeDays} session objects.
Format:
{
  "sessions": [
    {
      "dayNumber": 1,
      "content": "What to read today",
      "summary": "Summary in ${safeLang}",
      "keyIdea": "Core idea in ${safeLang}",
      "metaphor": "Metaphor analysis in ${safeLang}",
      "implementationTask": "Actionable step in ${safeLang}",
      "reflectionQuestion": "Reflection question in ${safeLang}"
    }
  ]
}`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 3000
      },
      { 
        headers: { 
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json' 
        } 
      }
    );

    let generatedText = response.data.choices[0].message.content;
    
    // Fallback regex to extract JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response.");
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    const sessionsData = parsedData.sessions || parsedData;

    // Create Reading Plan
    const readingPlan = new ReadingPlan({
      user: req.dbUser._id,
      book: book._id,
      durationDays: safeDays,
      readingMode: safeMode,
      language: safeLang
    });
    await readingPlan.save();

    // Create Sessions
    const sessions = sessionsData.map(sessionData => ({
      plan: readingPlan._id,
      ...sessionData,
      completed: false
    }));
    await Session.insertMany(sessions);

    res.json({ message: 'Reading plan generated successfully', planId: readingPlan._id });
  } catch (error) {
    console.error('Error generating plan:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate reading plan',
      details: error?.response?.data || error.message
    });
  }
});

// @route   GET /api/plans/:planId
// @desc    Get a reading plan and its sessions
// @access  Private
router.get('/:planId', verifyToken, async (req, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    const plan = await ReadingPlan.findById(req.params.planId).populate('book');
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    // Authorization check: ensure the plan belongs to the current user
    if (!plan.user.equals(req.dbUser._id)) {
      return res.status(403).json({ error: 'Unauthorized: This plan does not belong to you' });
    }

    const sessions = await Session.find({ plan: plan._id }).sort('dayNumber');

    res.json({ plan, sessions });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

module.exports = router;
