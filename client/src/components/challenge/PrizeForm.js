import React, { useState, useEffect } from 'react';
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
  Grid,
  IconButton,
  CircularProgress,
  Slider,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPrizeSuggestions } from '../../store/slices/aiSlice';

const prizeStructures = [
  {
    value: 'single',
    label: 'Single Winner',
    description: 'Award entire prize to one winner'
  },
  {
    value: 'tiered',
    label: 'Tiered Prizes',
    description: 'Distribute prizes among top performers'
  },
  {
    value: 'milestone',
    label: 'Milestone Based',
    description: 'Award prizes for achieving specific milestones'
  }
];

const complexityLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const PrizeForm = ({ data, onUpdate, onNext, onBack }) => {
  const dispatch = useDispatch();
  const { loading, prizeSuggestions } = useSelector((state) => state.ai);

  const [formData, setFormData] = useState({
    structure: data.prizes?.structure || 'single',
    amounts: data.prizes?.amounts || [],
    totalPrize: data.prizes?.totalPrize || 0,
    complexity: 'medium',
    duration: 30 // default 30 days
  });

  useEffect(() => {
    calculateTotalPrize();
  }, [formData.amounts]);

  const handleStructureChange = (e) => {
    const newStructure = e.target.value;
    setFormData({
      ...formData,
      structure: newStructure,
      amounts: []
    });
  };

  const handleAddPrize = () => {
    const newPrize = {
      rank: formData.amounts.length + 1,
      amount: 0,
      description: ''
    };
    setFormData({
      ...formData,
      amounts: [...formData.amounts, newPrize]
    });
  };

  const handleRemovePrize = (index) => {
    const updatedAmounts = formData.amounts.filter((_, i) => i !== index)
      .map((prize, i) => ({ ...prize, rank: i + 1 }));
    setFormData({
      ...formData,
      amounts: updatedAmounts
    });
  };

  const handlePrizeChange = (index, field, value) => {
    const updatedAmounts = formData.amounts.map((prize, i) => {
      if (i === index) {
        return { ...prize, [field]: value };
      }
      return prize;
    });
    setFormData({
      ...formData,
      amounts: updatedAmounts
    });
  };

  const calculateTotalPrize = () => {
    const total = formData.amounts.reduce((sum, prize) => sum + (prize.amount || 0), 0);
    setFormData(prev => ({ ...prev, totalPrize: total }));
  };

  const handleGetSuggestions = async () => {
    await dispatch(getPrizeSuggestions({
      challengeType: data.challengeType,
      complexity: formData.complexity,
      duration: formData.duration
    }));
  };

  const handleSubmit = () => {
    onUpdate({
      prizes: {
        structure: formData.structure,
        amounts: formData.amounts,
        totalPrize: formData.totalPrize
      }
    });
    onNext();
  };

  const isValid = () => {
    return (
      formData.structure &&
      formData.amounts.length > 0 &&
      formData.amounts.every(prize => prize.amount > 0) &&
      formData.totalPrize > 0
    );
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configure Prize Structure
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Prize Structure</InputLabel>
          <Select
            value={formData.structure}
            onChange={handleStructureChange}
            label="Prize Structure"
          >
            {prizeStructures.map((structure) => (
              <MenuItem key={structure.value} value={structure.value}>
                <Box>
                  <Typography variant="subtitle1">{structure.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {structure.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            AI Prize Recommendation Tool
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Challenge Complexity</InputLabel>
                <Select
                  value={formData.complexity}
                  onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                  label="Challenge Complexity"
                >
                  {complexityLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Challenge Duration (days)</Typography>
              <Slider
                value={formData.duration}
                onChange={(_, value) => setFormData({ ...formData, duration: value })}
                min={7}
                max={90}
                marks
                step={7}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>

          <Button
            variant="outlined"
            onClick={handleGetSuggestions}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Prize Suggestions'}
          </Button>

          {prizeSuggestions && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle1" gutterBottom>
                AI Suggestions
              </Typography>
              <Typography variant="body2">{prizeSuggestions}</Typography>
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Prize Distribution</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddPrize}
              variant="outlined"
              size="small"
            >
              Add Prize
            </Button>
          </Box>

          {formData.amounts.map((prize, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <Typography variant="body1" sx={{ pt: 2 }}>
                  {formData.structure === 'milestone' ? 'Milestone' : `${prize.rank}${prize.rank === 1 ? 'st' : prize.rank === 2 ? 'nd' : prize.rank === 3 ? 'rd' : 'th'} Place`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={prize.amount}
                  onChange={(e) => handlePrizeChange(index, 'amount', Number(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={formData.structure === 'milestone' ? 'Milestone Description' : 'Prize Description'}
                  value={prize.description}
                  onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Remove Prize">
                  <IconButton onClick={() => handleRemovePrize(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ))}

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Prize Pool: ${formData.totalPrize}
          </Typography>
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

export default PrizeForm;