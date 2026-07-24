const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const Book = require('../models/Book');
const ReadingPlan = require('../models/ReadingPlan');
const Session = require('../models/Session');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const aiService = require('../services/aiService');

// Validation Schema
const generatePlanSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  durationDays: z.number().min(1).max(30).default(7),
  readingMode: z.string().min(1).default('Deep Study'),
  language: z.string().min(1).default('English')
});

// Rate limiter for AI generation (5 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many AI requests. Please wait a minute before generating another plan.' }
});

// @route   POST /api/plans/generate
// @desc    Generate a new reading plan using AI
// @access  Private
router.post('/generate', verifyToken, aiLimiter, validate(generatePlanSchema), async (req, res, next) => {
  try {
    const { bookId, durationDays, readingMode, language } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    // Call AI Service
    const parsedData = await aiService.generateReadingPlan(book, {
      durationDays,
      readingMode,
      language
    });

    const sessionsData = parsedData.sessions || parsedData;

    // Create Reading Plan
    const readingPlan = new ReadingPlan({
      user: req.dbUser._id,
      book: book._id,
      durationDays,
      readingMode,
      language
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
    next(error); // Pass to global error handler
  }
});

// @route   GET /api/plans/:planId
// @desc    Get a reading plan and its sessions
// @access  Private
router.get('/:planId', verifyToken, async (req, res, next) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    const plan = await ReadingPlan.findById(req.params.planId).populate('book');
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    if (!plan.user.equals(req.dbUser._id)) {
      return res.status(403).json({ error: 'Unauthorized: This plan does not belong to you' });
    }

    const sessions = await Session.find({ plan: plan._id }).sort('dayNumber');

    res.json({ plan, sessions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
