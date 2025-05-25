import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { analyzeProblem } from '../../store/slices/aiSlice';

const challengeTypes = ['Ideation', 'Design', 'Development', 'Data Science'];

const IntakeForm = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();
  const { loading, recommendations } = useSelector((state) => state.ai);

  const [formData, setFormData] = useState({
    title: data.title || '',
    problemStatement: data.problemStatement || '',
    goals: data.goals || [],
    challengeType: data.challengeType || '',
    currentGoal: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddGoal = () => {
    if (formData.currentGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, formData.currentGoal.trim()],
        currentGoal: ''
      });
    }
  };

  const handleRemoveGoal = (goalToRemove) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((goal) => goal !== goalToRemove)
    });
  };

  const handleGetRecommendations = async () => {
    if (formData.problemStatement && formData.goals.length > 0) {
      await dispatch(analyzeProblem({
        problemStatement: formData.problemStatement,
        goals: formData.goals
      }));
    }
  };

  const handleSubmit = () => {
    onUpdate({
      title: formData.title,
      problemStatement: formData.problemStatement,
      goals: formData.goals,
      challengeType: formData.challengeType
    });
    onNext();
  };

  const isValid = () => {
    return (
      formData.title.trim() &&
      formData.problemStatement.trim() &&
      formData.goals.length > 0 &&
      formData.challengeType
    );
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Define Your Challenge
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Challenge Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Problem Statement"
          name="problemStatement"
          value={formData.problemStatement}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
          helperText="Clearly describe the problem or opportunity you want to address"
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Add Goal"
            name="currentGoal"
            value={formData.currentGoal}
            onChange={handleChange}
            onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            helperText="Press Enter to add a goal"
          />

          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.goals.map((goal, index) => (
              <Chip
                key={index}
                label={goal}
                onDelete={() => handleRemoveGoal(goal)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Challenge Type</InputLabel>
          <Select
            name="challengeType"
            value={formData.challengeType}
            onChange={handleChange}
            label="Challenge Type"
          >
            {challengeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleGetRecommendations}
            disabled={!formData.problemStatement || formData.goals.length === 0 || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Get AI Recommendations'}
          </Button>
        </Box>

        {recommendations && (
          <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" gutterBottom>
              AI Recommendations
            </Typography>
            <Typography variant="body2">{recommendations}</Typography>
          </Paper>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid()}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default IntakeForm;