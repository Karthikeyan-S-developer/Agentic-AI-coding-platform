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
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { validateRequirements } from '../../store/slices/aiSlice';

const submissionFormats = [
  { value: 'zip', label: 'ZIP File', description: 'Compressed archive of all submission files' },
  { value: 'git', label: 'Git Repository', description: 'Link to a Git repository' },
  { value: 'url', label: 'URL/Website', description: 'Link to deployed solution or documentation' },
  { value: 'file', label: 'Single File', description: 'Individual file upload' }
];

const commonRequirements = [
  'Source code with documentation',
  'README file with setup instructions',
  'Demo video (max 5 minutes)',
  'Presentation slides',
  'API documentation',
  'Test cases and results',
  'Performance metrics',
  'User manual',
  'Design assets'
];

const SubmissionForm = ({ data, onUpdate, onNext, onBack }) => {
  const dispatch = useDispatch();
  const { loading, validation } = useSelector((state) => state.ai);

  const [formData, setFormData] = useState({
    format: data.submission?.format || '',
    requirements: data.submission?.requirements || [],
    newRequirement: ''
  });

  const handleFormatChange = (e) => {
    setFormData({
      ...formData,
      format: e.target.value
    });
  };

  const handleAddRequirement = (requirement) => {
    if (requirement && !formData.requirements.includes(requirement)) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirement],
        newRequirement: ''
      });
    }
  };

  const handleRemoveRequirement = (requirementToRemove) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter(req => req !== requirementToRemove)
    });
  };

  const handleValidateRequirements = async () => {
    if (formData.requirements.length > 0) {
      await dispatch(validateRequirements(formData.requirements));
    }
  };

  const handleSubmit = () => {
    onUpdate({
      submission: {
        format: formData.format,
        requirements: formData.requirements
      }
    });
    onNext();
  };

  const isValid = () => {
    return formData.format && formData.requirements.length > 0;
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Define Submission Requirements
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Submission Format</InputLabel>
          <Select
            value={formData.format}
            onChange={handleFormatChange}
            label="Submission Format"
          >
            {submissionFormats.map((format) => (
              <MenuItem key={format.value} value={format.value}>
                <Box>
                  <Typography variant="subtitle1">{format.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Required Deliverables
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Common Requirements:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonRequirements.map((req) => (
                <Chip
                  key={req}
                  label={req}
                  onClick={() => handleAddRequirement(req)}
                  color="primary"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Add Custom Requirement"
            value={formData.newRequirement}
            onChange={(e) => setFormData({ ...formData, newRequirement: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement(formData.newRequirement)}
            helperText="Press Enter to add a custom requirement"
            margin="normal"
          />

          <List>
            {formData.requirements.map((requirement, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveRequirement(requirement)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={requirement} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleValidateRequirements}
            disabled={formData.requirements.length === 0 || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Validate Requirements with AI'}
          </Button>

          {validation && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle1" gutterBottom>
                AI Validation Results
              </Typography>
              <Typography variant="body2">{validation}</Typography>
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
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

export default SubmissionForm;