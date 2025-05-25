import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Chip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// Common languages for challenges
const commonLanguages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Portuguese',
  'Arabic'
];

// Common regions for challenges
const commonRegions = [
  'Global',
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania',
  'Middle East'
];

const AudienceForm = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    geographicConstraints: data.audience?.geographicConstraints || [],
    languages: data.audience?.languages || [],
    teamsAllowed: data.audience?.teamsAllowed ?? true,
    maxTeamSize: data.audience?.maxTeamSize || 5,
    communication: {
      forumEnabled: data.communication?.forumEnabled ?? true,
      questionBoardEnabled: data.communication?.questionBoardEnabled ?? true
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommunicationChange = (field) => {
    setFormData(prev => ({
      ...prev,
      communication: {
        ...prev.communication,
        [field]: !prev.communication[field]
      }
    }));
  };

  const handleSubmit = () => {
    onUpdate({
      audience: {
        geographicConstraints: formData.geographicConstraints,
        languages: formData.languages,
        teamsAllowed: formData.teamsAllowed,
        maxTeamSize: formData.maxTeamSize
      },
      communication: formData.communication
    });
    onNext();
  };

  const isValid = () => {
    return (
      formData.languages.length > 0 &&
      (!formData.teamsAllowed || (formData.teamsAllowed && formData.maxTeamSize > 1))
    );
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Define Your Audience
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          options={commonRegions}
          value={formData.geographicConstraints}
          onChange={(_, newValue) => handleChange('geographicConstraints', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Geographic Constraints"
              helperText="Select regions where participants can join from"
              margin="normal"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                color="primary"
                variant="outlined"
              />
            ))
          }
        />

        <Autocomplete
          multiple
          options={commonLanguages}
          value={formData.languages}
          onChange={(_, newValue) => handleChange('languages', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Required Languages"
              helperText="Select languages for challenge communication"
              margin="normal"
              required
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                color="primary"
                variant="outlined"
              />
            ))
          }
        />

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.teamsAllowed}
                onChange={() => handleChange('teamsAllowed', !formData.teamsAllowed)}
                color="primary"
              />
            }
            label="Allow Team Participation"
          />

          {formData.teamsAllowed && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Maximum Team Size</InputLabel>
              <Select
                value={formData.maxTeamSize}
                onChange={(e) => handleChange('maxTeamSize', e.target.value)}
                label="Maximum Team Size"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} members
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Communication Settings
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={formData.communication.forumEnabled}
                onChange={() => handleCommunicationChange('forumEnabled')}
                color="primary"
              />
            }
            label="Enable Discussion Forum"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.communication.questionBoardEnabled}
                onChange={() => handleCommunicationChange('questionBoardEnabled')}
                color="primary"
              />
            }
            label="Enable Question Board"
          />
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

export default AudienceForm;