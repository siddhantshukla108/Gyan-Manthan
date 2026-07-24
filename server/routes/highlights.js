const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const Highlight = require('../models/Highlight');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const aiService = require('../services/aiService');

const analyzeHighlightSchema = z.object({
  selectedText: z.string().min(1, 'Text to analyze is required'),
  language: z.string().min(1).default('English'),
  bookId: z.string().optional(),
  sessionId: z.string().optional()
});

// Rate limiter for AI analysis (5 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many AI requests. Please wait a minute before analyzing again.' }
});

// @route   POST /api/highlights/analyze
// @desc    Analyze a highlighted text using AI
// @access  Private
router.post('/analyze', verifyToken, aiLimiter, validate(analyzeHighlightSchema), async (req, res, next) => {
  try {
    const { selectedText, language, bookId, sessionId } = req.body;

    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    // Call AI Service
    const analysisData = await aiService.analyzeHighlight(selectedText, language);

    // Save highlight to database
    const highlight = new Highlight({
      user: req.dbUser._id,
      book: bookId || null,
      session: sessionId || null,
      selectedText,
      aiExplanation: analysisData.aiExplanation,
      metaphorType: analysisData.metaphorType,
      practicalApplication: analysisData.practicalApplication
    });

    await highlight.save();

    res.json({ highlight });
  } catch (error) {
    next(error); // Pass to global error handler
  }
});

module.exports = router;
