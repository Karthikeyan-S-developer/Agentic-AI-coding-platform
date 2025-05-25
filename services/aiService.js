const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    if (!this.model) {
      throw new Error('Failed to initialize Gemini model');
    }
  }
  async generateChallengeRecommendations(input) {
    try {
      const prompt = `Based on the following problem statement and goals, provide recommendations for challenge setup:\n\n` +
        `Problem Statement: ${input.problemStatement}\n` +
        `Goals: ${input.goals.join(', ')}\n\n` +
        `Please provide recommendations for:\n` +
        `1. Challenge type\n` +
        `2. Target audience\n` +
        `3. Submission format\n` +
        `4. Prize structure\n` +
        `5. Timeline suggestions`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate challenge recommendations');
    }
  }

  async validateSubmissionRequirements(requirements) {
    try {
      const prompt = `Review and validate the following challenge submission requirements:\n` +
        `${JSON.stringify(requirements, null, 2)}\n\n` +
        `Please check for:\n` +
        `1. Clarity and completeness\n` +
        `2. Technical feasibility\n` +
        `3. Potential improvements\n` +
        `4. Best practices alignment`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to validate submission requirements');
    }
  }

  async suggestPrizeStructure(challengeType, complexity, duration) {
    try {
      const prompt = `Suggest an appropriate prize structure for a challenge with the following parameters:\n` +
        `Type: ${challengeType}\n` +
        `Complexity: ${complexity}\n` +
        `Duration: ${duration}\n\n` +
        `Please provide:\n` +
        `1. Recommended prize structure (single/tiered/milestone)\n` +
        `2. Suggested prize amounts\n` +
        `3. Justification for the recommendation\n` +
        `4. Industry benchmarks if applicable`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to suggest prize structure');
    }
  }

  async generateEvaluationCriteria(challengeType, goals) {
    try {
      const prompt = `Create evaluation criteria for a ${challengeType} challenge with the following goals:\n` +
        `${goals.join('\n')}\n\n` +
        `Please provide:\n` +
        `1. Specific evaluation criteria\n` +
        `2. Suggested weights for each criterion\n` +
        `3. Scoring guidelines\n` +
        `4. Recommended evaluation approach (AI/peer/expert review)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate evaluation criteria');
    }
  }
}