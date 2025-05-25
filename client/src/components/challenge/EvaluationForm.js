import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { analyzeEvaluationCriteria } from '../../store/slices/aiSlice';

const defaultCriteria = [
  { name: 'Technical Implementation', weight: 30, description: 'Code quality, documentation clarity, scalability, and architecture' },
  { name: 'Innovation', weight: 25, description: 'Uniqueness and creativity of the solution' },
  { name: 'Functionality', weight: 25, description: 'How well the solution meets the requirements' },
  { name: 'User Experience', weight: 20, description: 'Usability, interface design, and overall user interaction' }
];

const EvaluationForm = ({ data, onUpdate, onNext, onBack }) => {
  const dispatch = useDispatch();
  const aiSuggestions = useSelector(state => state.ai.evaluationSuggestions);
  const aiLoading = useSelector(state => state.ai.loading);

  const [formData, setFormData] = useState({
    evaluationType: data.evaluation?.evaluationType || 'post-submission',
    peerReview: data.evaluation?.peerReview || false,
    aiReview: data.evaluation?.aiReview || false,
    criteria: data.evaluation?.criteria || [],
    reviewers: data.evaluation?.reviewers || [],
    minimumReviews: data.evaluation?.minimumReviews || 3
  });

  const [error, setError] = useState(null);

  const handleEvaluationTypeChange = (event) => {
    setFormData(prev => ({
      ...prev,
      evaluationType: event.target.value
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleAddCriterion = () => {
    const newCriterion = {
      name: '',
      weight: 0,
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriterion]
    }));
  };

  const handleRemoveCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index)
    }));
  };

  const handleCriterionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map((criterion, i) => {
        if (i === index) {
          return { ...criterion, [field]: value };
        }
        return criterion;
      })
    }));
    validateWeights();
  };

  const validateWeights = () => {
    const totalWeight = formData.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (totalWeight !== 100) {
      setError(`Total weight must equal 100%. Current total: ${totalWeight}%`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleAddDefaultCriteria = () => {
    setFormData(prev => ({
      ...prev,
      criteria: defaultCriteria
    }));
  };

  const handleAddReviewer = () => {
    const newReviewer = {
      email: '',
      role: 'expert'
    };
    setFormData(prev => ({
      ...prev,
      reviewers: [...prev.reviewers, newReviewer]
    }));
  };

  const handleRemoveReviewer = (index) => {
    setFormData(prev => ({
      ...prev,
      reviewers: prev.reviewers.filter((_, i) => i !== index)
    }));
  };

  const handleReviewerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reviewers: prev.reviewers.map((reviewer, i) => {
        if (i === index) {
          return { ...reviewer, [field]: value };
        }
        return reviewer;
      })
    }));
  };

  const handleGetAISuggestions = async () => {
    const challengeData = {
      type: data.type,
      problemStatement: data.problemStatement,
      goals: data.goals
    };
    await dispatch(analyzeEvaluationCriteria(challengeData));
  };

  const handleSubmit = () => {
    if (validateWeights()) {
      onUpdate({
        evaluation: {
          evaluationType: formData.evaluationType,
          peerReview: formData.peerReview,
          aiReview: formData.aiReview,
          criteria: formData.criteria,
          reviewers: formData.reviewers,
          minimumReviews: formData.minimumReviews
        }
      });
      onNext();
    }
  };

  const isValid = () => {
    return (
      formData.criteria.length > 0 &&
      formData.criteria.every(c => c.name && c.weight && c.description) &&
      formData.reviewers.every(r => r.email && r.role) &&
      !error
    );
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Set Evaluation Criteria
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Evaluation Type</InputLabel>
          <Select
            value={formData.evaluationType}
            onChange={handleEvaluationTypeChange}
            label="Evaluation Type"
          >
            <MenuItem value="rolling">Rolling (Evaluate as submissions arrive)</MenuItem>
            <MenuItem value="post-submission">Post-submission (Evaluate after deadline)</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.peerReview}
                  onChange={handleSwitchChange('peerReview')}
                />
              }
              label="Enable Peer Review"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.aiReview}
                  onChange={handleSwitchChange('aiReview')}
                />
              }
              label="Enable AI Review"
            />
          </Grid>
        </Grid>

        {(formData.peerReview || formData.aiReview) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Minimum Reviews Required
            </Typography>
            <Slider
              value={formData.minimumReviews}
              onChange={(_, value) => setFormData(prev => ({ ...prev, minimumReviews: value }))}
              min={1}
              max={10}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Evaluation Criteria</Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={handleAddDefaultCriteria}
                sx={{ mr: 1 }}
                disabled={formData.criteria.length > 0}
              >
                Add Default Criteria
              </Button>
              <Button
                variant="outlined"
                onClick={handleGetAISuggestions}
                sx={{ mr: 1 }}
                disabled={aiLoading}
              >
                Get AI Suggestions
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddCriterion}
                variant="outlined"
              >
                Add Criterion
              </Button>
            </Box>
          </Box>

          {aiSuggestions && (
            <Alert severity="info" sx={{ mb: 2 }}>
              AI Suggestions: {aiSuggestions}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {formData.criteria.map((criterion, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Criterion Name"
                  value={criterion.name}
                  onChange={(e) => handleCriterionChange(index, 'name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Weight (%)"
                  value={criterion.weight}
                  onChange={(e) => handleCriterionChange(index, 'weight', parseInt(e.target.value) || 0)}
                  required
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={criterion.description}
                  onChange={(e) => handleCriterionChange(index, 'description', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Tooltip title="Remove Criterion">
                  <IconButton onClick={() => handleRemoveCriterion(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Reviewers</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddReviewer}
              variant="outlined"
            >
              Add Reviewer
            </Button>
          </Box>

          {formData.reviewers.map((reviewer, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={reviewer.email}
                  onChange={(e) => handleReviewerChange(index, 'email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={reviewer.role}
                    onChange={(e) => handleReviewerChange(index, 'role', e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="expert">Expert Reviewer</MenuItem>
                    <MenuItem value="peer">Peer Reviewer</MenuItem>
                    <MenuItem value="moderator">Moderator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Tooltip title="Remove Reviewer">
                  <IconButton onClick={() => handleRemoveReviewer(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onBack}>Back</Button>
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

export default EvaluationForm;