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
  Alert,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

const defaultMilestones = [
  { name: 'Registration Opens', date: null, description: 'Start accepting participant registrations' },
  { name: 'Registration Closes', date: null, description: 'Last day to register for the challenge' },
  { name: 'Submission Opens', date: null, description: 'Start accepting challenge submissions' },
  { name: 'Submission Closes', date: null, description: 'Final deadline for all submissions' },
  { name: 'Review Period', date: null, description: 'Evaluation of submitted solutions' },
  { name: 'Winners Announced', date: null, description: 'Announcement of challenge winners' }
];

const TimelineForm = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    startDate: data.timeline?.startDate ? moment(data.timeline.startDate) : null,
    endDate: data.timeline?.endDate ? moment(data.timeline.endDate) : null,
    milestones: data.timeline?.milestones || []
  });

  const [error, setError] = useState(null);

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    validateDates(field === 'startDate' ? value : formData.startDate, field === 'endDate' ? value : formData.endDate);
  };

  const validateDates = (start, end) => {
    if (start && end && moment(end).isBefore(moment(start))) {
      setError('End date must be after start date');
      return false;
    }
    setError(null);
    return true;
  };

  const handleAddMilestone = () => {
    const newMilestone = {
      name: '',
      date: null,
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const handleRemoveMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => {
        if (i === index) {
          return { ...milestone, [field]: value };
        }
        return milestone;
      })
    }));
  };

  const handleAddDefaultMilestones = () => {
    const startDate = formData.startDate;
    const endDate = formData.endDate;

    if (!startDate || !endDate) return;

    const duration = moment.duration(endDate.diff(startDate));
    const days = duration.asDays();

    const defaultDates = [
      startDate.clone(),
      startDate.clone().add(days * 0.2, 'days'),
      startDate.clone().add(days * 0.3, 'days'),
      endDate.clone().subtract(days * 0.2, 'days'),
      endDate.clone().subtract(days * 0.1, 'days'),
      endDate.clone()
    ];

    const newMilestones = defaultMilestones.map((milestone, index) => ({
      ...milestone,
      date: defaultDates[index]
    }));

    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const handleSubmit = () => {
    if (validateDates(formData.startDate, formData.endDate)) {
      onUpdate({
        timeline: {
          startDate: formData.startDate?.toDate(),
          endDate: formData.endDate?.toDate(),
          milestones: formData.milestones.map(m => ({
            ...m,
            date: m.date?.toDate()
          }))
        }
      });
      onNext();
    }
  };

  const isValid = () => {
    return (
      formData.startDate &&
      formData.endDate &&
      !error &&
      formData.milestones.every(m => m.name && m.date && m.description)
    );
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Set Challenge Timeline
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate ? formData.startDate.format('YYYY-MM-DD') : ''}
              onChange={(e) => handleDateChange('startDate', moment(e.target.value))}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate ? formData.endDate.format('YYYY-MM-DD') : ''}
              onChange={(e) => handleDateChange('endDate', moment(e.target.value))}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Milestones</Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={handleAddDefaultMilestones}
                sx={{ mr: 1 }}
                disabled={!formData.startDate || !formData.endDate}
              >
                Add Default Milestones
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddMilestone}
                variant="outlined"
              >
                Add Custom Milestone
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2}>
            {formData.milestones.map((milestone, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Milestone Name"
                        value={milestone.name}
                        onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Milestone Date"
                        type="date"
                        value={milestone.date ? milestone.date.format('YYYY-MM-DD') : ''}
                        onChange={(e) => handleMilestoneChange(index, 'date', moment(e.target.value))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Description"
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton onClick={() => handleRemoveMilestone(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="contained" onClick={onBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid()}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default TimelineForm;