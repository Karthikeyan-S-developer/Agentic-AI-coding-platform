const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  goals: [{
    type: String,
    required: true
  }],
  challengeType: {
    type: String,
    enum: ['Ideation', 'Design', 'Development', 'Data Science'],
    required: true
  },
  audience: {
    geographicConstraints: [String],
    languages: [String],
    teamsAllowed: {
      type: Boolean,
      default: true
    },
    maxTeamSize: Number
  },
  communication: {
    forumEnabled: {
      type: Boolean,
      default: true
    },
    questionBoardEnabled: {
      type: Boolean,
      default: true
    }
  },
  submission: {
    format: {
      type: String,
      enum: ['zip', 'git', 'url', 'file'],
      required: true
    },
    requirements: [{
      type: String,
      required: true
    }]
  },
  prizes: {
    structure: {
      type: String,
      enum: ['single', 'tiered', 'milestone'],
      required: true
    },
    amounts: [{
      rank: Number,
      amount: Number,
      description: String
    }],
    totalPrize: {
      type: Number,
      required: true
    }
  },
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    milestones: [{
      name: String,
      date: Date,
      description: String
    }]
  },
  evaluation: {
    model: {
      type: String,
      enum: ['rolling', 'post-submission'],
      required: true
    },
    reviewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    criteria: [{
      name: String,
      weight: Number,
      description: String
    }],
    rubric: {
      useAIReview: {
        type: Boolean,
        default: false
      },
      usePeerReview: {
        type: Boolean,
        default: false
      },
      scoringSystem: {
        type: String,
        enum: ['points', 'percentage', 'custom'],
        default: 'points'
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  announcements: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);