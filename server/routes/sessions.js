const express = require('express');
const router = express.Router();
const ReadingPlan = require('../models/ReadingPlan');
const Session = require('../models/Session');
const { verifyToken } = require('../middleware/auth');

// @route   PATCH /api/sessions/:sessionId/complete
// @desc    Toggle session completion status
// @access  Private
router.patch('/:sessionId/complete', verifyToken, async (req, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    const session = await Session.findById(req.params.sessionId).populate({
      path: 'plan',
      select: 'user'
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Authorization: check that the session belongs to the current user
    if (!session.plan.user.equals(req.dbUser._id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    session.completed = !session.completed;
    await session.save();

    res.json({ message: 'Session updated', session });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// @route   POST /api/sessions/:sessionId/notes
// @desc    Generate detailed reading notes for a session
// @access  Private
router.post('/:sessionId/notes', verifyToken, async (req, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    const session = await Session.findById(req.params.sessionId).populate({
      path: 'plan',
      populate: { path: 'book' }
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Authorization
    if (!session.plan.user.equals(req.dbUser._id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.readingNotes) {
      return res.json({ notes: session.readingNotes });
    }

    const aiService = require('../services/aiService');
    const notes = await aiService.generateReadingNotes(
      session.plan.book.title,
      session.plan.book.author,
      session.plan.language,
      session.content
    );

    session.readingNotes = notes;
    await session.save();

    res.json({ notes });
  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ error: 'Failed to generate notes' });
  }
});
// @route   GET /api/sessions/user/plans
// @desc    Get all reading plans for the current user with progress info
// @access  Private
router.get('/user/plans', verifyToken, async (req, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: 'User not found' });

    const plans = await ReadingPlan.find({ user: req.dbUser._id })
      .populate('book')
      .sort({ createdAt: -1 });

    // For each plan, compute session completion stats
    const plansWithProgress = await Promise.all(plans.map(async (plan) => {
      const sessions = await Session.find({ plan: plan._id });
      const completedCount = sessions.filter(s => s.completed).length;
      return {
        ...plan.toObject(),
        totalSessions: sessions.length,
        completedSessions: completedCount
      };
    }));

    res.json(plansWithProgress);
  } catch (error) {
    console.error('Error fetching user plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

module.exports = router;
