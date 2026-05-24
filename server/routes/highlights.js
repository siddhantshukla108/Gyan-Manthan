const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const Highlight = require('../models/Highlight');
const { verifyToken } = require('../middleware/auth');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Rate limiter for AI analysis (5 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many AI requests. Please wait a minute before analyzing again.' }
});

// Sanitize user input before injecting into LLM prompts
function sanitizeForPrompt(str) {
  if (typeof str !== 'string') return '';
  // Remove control characters but keep all printable Unicode (for multi-language support)
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 1000);
}

// @route   POST /api/highlights/analyze
// @desc    Analyze a highlighted text using AI
// @access  Private
router.post('/analyze', verifyToken, aiLimiter, async (req, res) => {
  try {
    const { selectedText, language, bookId, sessionId } = req.body;

    if (!selectedText) {
      return res.status(400).json({ error: 'Text to analyze is required' });
    }

    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    const safeText = sanitizeForPrompt(selectedText);
    const safeLang = sanitizeForPrompt(language);

    const prompt = `You are an expert literary analyst and multilingual tutor. 
Analyze the following highlighted text from a book: "${safeText}".

Please provide a JSON response with the following structure:
{
  "aiExplanation": (String: Deep meaning and context of this text explained clearly in ${safeLang}),
  "metaphorType": (String: Identify any metaphor, literary device, or emotional tone used, explained in ${safeLang}),
  "practicalApplication": (String: How can the reader apply this specific quote to real life? in ${safeLang})
}
Ensure valid JSON output. Escape quotes inside string values.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1500
      },
      { 
        headers: { 
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json' 
        } 
      }
    );

    let generatedText = response.data.choices[0].message.content;
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response.");
    }
    const analysisData = JSON.parse(jsonMatch[0]);

    // Save highlight to database
    const highlight = new Highlight({
      user: req.dbUser._id,
      book: bookId || null,
      session: sessionId || null,
      selectedText: safeText,
      aiExplanation: analysisData.aiExplanation,
      metaphorType: analysisData.metaphorType,
      practicalApplication: analysisData.practicalApplication
    });

    await highlight.save();

    res.json({ highlight });
  } catch (error) {
    console.error('Error analyzing highlight:', error?.response?.data || error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

module.exports = router;
