const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge.js');
const auth = require('../middleware/auth.js');
const aiService = require('../services/aiService.js');

// @route   POST api/challenges
// @desc    Create a new challenge
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, problemStatement, goals, challengeType, submission, prizes, timeline } = req.body;

    // Validate required fields
    if (!title || !problemStatement || !goals || !challengeType || !submission || !prizes || !timeline) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Validate timeline
    const now = new Date();
    if (new Date(timeline.startDate) < now) {
      return res.status(400).json({ msg: 'Start date must be in the future' });
    }
    if (new Date(timeline.endDate) <= new Date(timeline.startDate)) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }

    const challenge = new Challenge({
      ...req.body,
      creator: req.user.id,
      status: 'active' // Set status to active when creating
    });
    await challenge.save();
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('creator', ['name', 'organization'])
      .sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/challenges/:id
// @desc    Get challenge by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('creator', ['name', 'organization'])
      .populate('evaluation.reviewers', ['name', 'expertise']);
    
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Challenge not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/challenges/:id
// @desc    Update challenge
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    // Verify challenge owner
    if (challenge.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/challenges/:id/announcements
// @desc    Add announcement to challenge
// @access  Private
router.post('/:id/announcements', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    // Verify challenge owner
    if (challenge.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    challenge.announcements.unshift(req.body);
    await challenge.save();

    res.json(challenge.announcements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/challenges/:id/ai/recommendations
// @desc    Get AI recommendations for challenge setup
// @access  Private
router.post('/:id/ai/recommendations', auth, async (req, res) => {
  try {
    const recommendations = await aiService.generateChallengeRecommendations(req.body);
    res.json({ recommendations });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/challenges/:id/ai/validate-requirements
// @desc    Validate submission requirements using AI
// @access  Private
router.post('/:id/ai/validate-requirements', auth, async (req, res) => {
  try {
    const validation = await aiService.validateSubmissionRequirements(req.body);
    res.json({ validation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/challenges/:id/ai/prize-structure
// @desc    Get AI suggestions for prize structure
// @access  Private
router.post('/:id/ai/prize-structure', auth, async (req, res) => {
  try {
    const { challengeType, complexity, duration } = req.body;
    const suggestion = await aiService.suggestPrizeStructure(challengeType, complexity, duration);
    res.json({ suggestion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;