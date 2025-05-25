import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Analyze problem statement
export const analyzeProblem = createAsyncThunk(
  'ai/analyzeProblem',
  async (problemData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      if (!problemData || !problemData.problemStatement || !problemData.goals) {
        return rejectWithValue('Problem statement and goals are required');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/ai/analyze-problem', problemData, config);
      
      if (!res.data || !res.data.recommendations) {
        throw new Error('Invalid response from AI service');
      }

      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || 'Failed to analyze problem';
      console.error('AI analysis error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Validate submission requirements
export const validateRequirements = createAsyncThunk(
  'ai/validateRequirements',
  async (requirements, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/ai/validate-requirements', { requirements }, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to validate requirements');
    }
  }
);

// Get prize suggestions
export const getPrizeSuggestions = createAsyncThunk(
  'ai/getPrizeSuggestions',
  async (prizeData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/ai/suggest-prize', prizeData, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to get prize suggestions');
    }
  }
);

// Get evaluation criteria
export const getEvaluationCriteria = createAsyncThunk(
  'ai/getEvaluationCriteria',
  async (criteriaData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/ai/evaluation-criteria', criteriaData, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to get evaluation criteria');
    }
  }
);

const initialState = {
  recommendations: null,
  validation: null,
  prizeSuggestions: null,
  evaluationCriteria: null,
  loading: false,
  error: null
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAIState: (state) => {
      state.recommendations = null;
      state.validation = null;
      state.prizeSuggestions = null;
      state.evaluationCriteria = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Analyze problem
      .addCase(analyzeProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.recommendations;
        state.error = null;
      })
      .addCase(analyzeProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Validate requirements
      .addCase(validateRequirements.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateRequirements.fulfilled, (state, action) => {
        state.loading = false;
        state.validation = action.payload.validation;
        state.error = null;
      })
      .addCase(validateRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get prize suggestions
      .addCase(getPrizeSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPrizeSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.prizeSuggestions = action.payload.suggestion;
        state.error = null;
      })
      .addCase(getPrizeSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get evaluation criteria
      .addCase(getEvaluationCriteria.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvaluationCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluationCriteria = action.payload.criteria;
        state.error = null;
      })
      .addCase(getEvaluationCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Analyze evaluation criteria (Placeholder)
export const analyzeEvaluationCriteria = createAsyncThunk(
  'ai/analyzeEvaluationCriteria',
  async (criteriaData, { rejectWithValue, getState }) => {
    try {
      // Placeholder logic: Assuming it analyzes criteria data
      console.log('Analyzing evaluation criteria:', criteriaData);
      // Replace with actual API call or logic if needed
      // const res = await axios.post('/api/ai/analyze-evaluation', criteriaData, config);
      // return res.data;
      return { analysisResult: 'Placeholder analysis result' };
    } catch (err) {
      // return rejectWithValue(err.response?.data?.msg || 'Failed to analyze evaluation criteria');
      return rejectWithValue('Failed to analyze evaluation criteria (Placeholder error)');
    }
  }
);

export const { clearAIState, clearError } = aiSlice.actions;

export default aiSlice.reducer;