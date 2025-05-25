import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Load user
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue, dispatch }) => {
  dispatch(clearError());
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('token');
      throw new Error('No token found');
    }

    const config = {
      headers: {
        'x-auth-token': token
      }
    };

    const res = await axios.get('/api/users/me', config);
    if (!res.data) {
      throw new Error('No user data received');
    }
    return res.data;
  } catch (err) {
    localStorage.removeItem('token');
    if (err.response?.status === 401) {
      return rejectWithValue('Session expired. Please login again.');
    }
    return rejectWithValue(err.response?.data?.msg || err.message || 'Authentication failed');
  }
});

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue, dispatch }) => {
    dispatch(clearError());
    try {
      if (!formData.email || !formData.password || !formData.name) {
        throw new Error('Please fill in all required fields');
      }

      const res = await axios.post('/api/users/register', formData);
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue, dispatch }) => {
    dispatch(clearError());
    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      const res = await axios.post('/api/users/login', formData);
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue('Invalid email or password');
      }
      return rejectWithValue(err.response?.data?.msg || err.message || 'Login failed');
    }
  }
);

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;