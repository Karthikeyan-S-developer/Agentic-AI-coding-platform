import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all challenges
export const getChallenges = createAsyncThunk(
  'challenges/getChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/challenges');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch challenges');
    }
  }
);

// Get challenge by ID
export const getChallengeById = createAsyncThunk(
  'challenges/getChallengeById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/challenges/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch challenge');
    }
  }
);

// Create challenge
export const createChallenge = createAsyncThunk(
  'challenges/createChallenge',
  async (challengeData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      // Validate required fields before making API call
      const requiredFields = ['title', 'problemStatement', 'goals', 'challengeType', 'submission', 'prizes', 'timeline'];
      const missingFields = requiredFields.filter(field => !challengeData[field]);
      
      if (missingFields.length > 0) {
        return rejectWithValue(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/challenges', challengeData, config);
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || 'Failed to create challenge';
      console.error('Challenge creation error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update challenge
export const updateChallenge = createAsyncThunk(
  'challenges/updateChallenge',
  async ({ id, challengeData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.put(`/api/challenges/${id}`, challengeData, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update challenge');
    }
  }
);

// Submit solution
export const submitSolution = createAsyncThunk(
  'challenges/submitSolution',
  async ({ challengeId, ...solutionData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post(`/api/challenges/${challengeId}/submissions`, solutionData, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to submit solution');
    }
  }
);

// Add announcement
export const addAnnouncement = createAsyncThunk(
  'challenges/addAnnouncement',
  async ({ id, announcement }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post(`/api/challenges/${id}/announcements`, announcement, config);
      return { id, announcements: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to add announcement');
    }
  }
);

const initialState = {
  challenges: [],
  currentChallenge: null,
  loading: false,
  error: null,
  success: false
};

const challengeSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    clearCurrentChallenge: (state) => {
      state.currentChallenge = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all challenges
      .addCase(getChallenges.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
        state.error = null;
      })
      .addCase(getChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get challenge by ID
      .addCase(getChallengeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChallengeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChallenge = action.payload;
        state.error = null;
      })
      .addCase(getChallengeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create challenge
      .addCase(createChallenge.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges.unshift(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update challenge
      .addCase(updateChallenge.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = state.challenges.map(challenge =>
          challenge._id === action.payload._id ? action.payload : challenge
        );
        state.currentChallenge = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add announcement
      .addCase(addAnnouncement.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentChallenge && state.currentChallenge._id === action.payload.id) {
          state.currentChallenge.announcements = action.payload.announcements;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(addAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit solution
      .addCase(submitSolution.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSolution.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentChallenge) {
          state.currentChallenge.submissions = [
            ...state.currentChallenge.submissions,
            action.payload
          ];
        }
        state.success = true;
        state.error = null;
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentChallenge, clearError, resetSuccess } = challengeSlice.actions;

export default challengeSlice.reducer;