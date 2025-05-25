import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import challengeReducer from './slices/challengeSlice';
import aiReducer from './slices/aiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    challenges: challengeReducer,
    ai: aiReducer
  }
});

export default store;