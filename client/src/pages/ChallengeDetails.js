import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { getChallengeById as getChallenge, submitSolution } from '../store/slices/challengeSlice';

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentChallenge, loading, error } = useSelector(state => state.challenges);
  const { user } = useSelector(state => state.auth);

  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [submission, setSubmission] = useState({
    solutionUrl: '',
    description: ''
  });

  useEffect(() => {
    dispatch(getChallenge(id));
  }, [dispatch, id]);

  const handleSubmit = async () => {
    try {
      await dispatch(submitSolution({ challengeId: id, ...submission })).unwrap();
      setOpenSubmitDialog(false);
      // Refresh challenge data to show new submission
      dispatch(getChallenge(id));
    } catch (err) {
      // Error handling is done through Redux state
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentChallenge) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Challenge not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {currentChallenge.title}
              </Typography>
              <Chip
                label={currentChallenge.status}
                color={currentChallenge.status === 'OPEN' ? 'success' : 'default'}
              />
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              {currentChallenge.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Challenge Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Prize Pool"
                  secondary={`$${currentChallenge.prizeAmount}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Deadline"
                  secondary={formatDate(currentChallenge.deadline)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Created By"
                  secondary={currentChallenge.creator?.name}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Evaluation Criteria
            </Typography>
            <List>
              {currentChallenge.evaluationCriteria?.map((criteria, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={criteria.name}
                    secondary={criteria.description}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Submissions ({currentChallenge.submissions?.length || 0})
            </Typography>
            {currentChallenge.submissions?.length > 0 ? (
              <List>
                {currentChallenge.submissions.map((submission, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={submission.user?.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {submission.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Submitted on: {formatDate(submission.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No submissions yet
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Back
              </Button>
              {currentChallenge.status === 'OPEN' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenSubmitDialog(true)}
                  disabled={currentChallenge.creator?._id === user?._id}
                >
                  Submit Solution
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openSubmitDialog} onClose={() => setOpenSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Solution</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Solution URL"
            name="solutionUrl"
            value={submission.solutionUrl}
            onChange={(e) => setSubmission({ ...submission, solutionUrl: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={submission.description}
            onChange={(e) => setSubmission({ ...submission, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChallengeDetails;