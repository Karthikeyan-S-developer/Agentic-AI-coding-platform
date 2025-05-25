const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const aiService = require('../services/aiService.js');

// @route   POST api/ai/analyze-problem
// @desc    Analyze problem statement and generate recommendations
// @access  Private
router.post('/analyze-problem', auth, async (req, res) => {
  try {
    const recommendations = await aiService.generateChallengeRecommendations({
      problemStatement: req.body.problemStatement,
      goals: req.body.goals
    });
    res.json({ recommendations });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/validate-requirements
// @desc    Validate and improve submission requirements
// @access  Private
router.post('/validate-requirements', auth, async (req, res) => {
  try {
    const validation = await aiService.validateSubmissionRequirements(req.body.requirements);
    res.json({ validation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/suggest-prize
// @desc    Get prize structure suggestions
// @access  Private
router.post('/suggest-prize', auth, async (req, res) => {
  try {
    const { challengeType, complexity, duration } = req.body;
    const suggestion = await aiService.suggestPrizeStructure(
      challengeType,
      complexity,
      duration
    );
    res.json({ suggestion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/evaluation-criteria
// @desc    Generate evaluation criteria based on challenge type and goals
// @access  Private
router.post('/evaluation-criteria', auth, async (req, res) => {
  try {
    const { challengeType, goals } = req.body;
    const criteria = await aiService.generateEvaluationCriteria(challengeType, goals);
    res.json({ criteria });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;