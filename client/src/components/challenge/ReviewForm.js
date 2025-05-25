import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { createChallenge } from '../../store/slices/challengeSlice';

const ReviewForm = ({ data, onBack }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.challenges.loading);
  const error = useSelector(state => state.challenges.error);

  const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm a');
  };

  const handleLaunch = async () => {
    await dispatch(createChallenge(data));
  };

  const renderSection = (title, content) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>
      {content}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  const renderBasicInfo = () => (
    <List dense>
      <ListItem>
        <ListItemText
          primary="Challenge Title"
          secondary={data.title}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Challenge Type"
          secondary={data.type}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Problem Statement"
          secondary={data.problemStatement}
          secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Goals"
          secondary={
            <Box sx={{ mt: 1 }}>
              {data.goals.map((goal, index) => (
                <Chip
                  key={index}
                  label={goal}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>
          }
        />
      </ListItem>
    </List>
  );

  const renderAudienceInfo = () => (
    <List dense>
      <ListItem>
        <ListItemText
          primary="Geographic Constraints"
          secondary={data.audience?.geographicConstraints?.join(', ') || 'None'}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Required Languages"
          secondary={
            <Box sx={{ mt: 1 }}>
              {data.audience?.requiredLanguages?.map((lang, index) => (
                <Chip
                  key={index}
                  label={lang}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Team Participation"
          secondary={`${data.audience?.teamParticipation ? 'Allowed' : 'Not Allowed'}`}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Communication Features"
          secondary={
            <Box sx={{ mt: 1 }}>
              {data.audience?.discussionForum && <Chip label="Discussion Forum" sx={{ mr: 1, mb: 1 }} size="small" />}
              {data.audience?.questionBoard && <Chip label="Question Board" sx={{ mr: 1, mb: 1 }} size="small" />}
            </Box>
          }
        />
      </ListItem>
    </List>
  );

  const renderSubmissionInfo = () => (
    <List dense>
      <ListItem>
        <ListItemText
          primary="Submission Format"
          secondary={data.submission?.format}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Required Deliverables"
          secondary={
            <Box sx={{ mt: 1 }}>
              {data.submission?.deliverables?.map((deliverable, index) => (
                <Chip
                  key={index}
                  label={deliverable}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>
          }
        />
      </ListItem>
    </List>
  );

  const renderPrizeInfo = () => (
    <List dense>
      <ListItem>
        <ListItemText
          primary="Prize Structure"
          secondary={data.prizes?.structure}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Prize Pool"
          secondary={
            <Box sx={{ mt: 1 }}>
              {data.prizes?.items?.map((prize, index) => (
                <Chip
                  key={index}
                  label={`${prize.place}: $${prize.amount}`}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>
          }
        />
      </ListItem>
    </List>
  );

  const renderTimelineInfo = () => (
    <List dense>
      <ListItem>
        <ListItemText
          primary="Challenge Duration"
          secondary={`${formatDate(data.timeline?.startDate)} - ${formatDate(data.timeline?.endDate)}`}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Milestones"
          secondary={
            <List dense>
              {data.timeline?.milestones?.map((milestone, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemText
                    primary={milestone.name}
                    secondary={`${formatDate(milestone.date)} - ${milestone.description}`}
                  />
                </ListItem>
              ))}
            </List>
          }
        />
      </ListItem>
    </List>
  );

  const renderEvaluationInfo = () => (
    <List dense>
      <ListItem>
        <ListItemText
          primary="Evaluation Type"
          secondary={data.evaluation?.evaluationType === 'rolling' ? 'Rolling (Evaluate as submissions arrive)' : 'Post-submission (Evaluate after deadline)'}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Review Methods"
          secondary={
            <Box sx={{ mt: 1 }}>
              {data.evaluation?.peerReview && <Chip label="Peer Review" sx={{ mr: 1, mb: 1 }} size="small" />}
              {data.evaluation?.aiReview && <Chip label="AI Review" sx={{ mr: 1, mb: 1 }} size="small" />}
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Evaluation Criteria"
          secondary={
            <List dense>
              {data.evaluation?.criteria?.map((criterion, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemText
                    primary={`${criterion.name} (${criterion.weight}%)`}
                    secondary={criterion.description}
                  />
                </ListItem>
              ))}
            </List>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Reviewers"
          secondary={
            <List dense>
              {data.evaluation?.reviewers?.map((reviewer, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemText
                    primary={reviewer.email}
                    secondary={`Role: ${reviewer.role}`}
                  />
                </ListItem>
              ))}
            </List>
          }
        />
      </ListItem>
    </List>
  );

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        Review Challenge Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderSection('Basic Information', renderBasicInfo())}
          {renderSection('Audience & Participation', renderAudienceInfo())}
          {renderSection('Submission Requirements', renderSubmissionInfo())}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSection('Prize Structure', renderPrizeInfo())}
          {renderSection('Timeline', renderTimelineInfo())}
          {renderSection('Evaluation Process', renderEvaluationInfo())}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLaunch}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Launching...' : 'Launch Challenge'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewForm;