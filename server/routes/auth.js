const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/auth/sync
// @desc    Sync Firebase user with MongoDB (create if doesn't exist)
// @access  Private
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name || email.split('@')[0], // Fallback if name is not available
      });
      await user.save();
    }

    res.json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found in DB' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
