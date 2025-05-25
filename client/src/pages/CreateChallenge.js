import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Typography, Container } from '@mui/material';

// Components
import IntakeForm from '../components/challenge/IntakeForm';
import AudienceForm from '../components/challenge/AudienceForm';
import SubmissionForm from '../components/challenge/SubmissionForm';
import PrizeForm from '../components/challenge/PrizeForm';
import TimelineForm from '../components/challenge/TimelineForm';
import EvaluationForm from '../components/challenge/EvaluationForm';
import ReviewForm from '../components/challenge/ReviewForm';

// Actions
import { createChallenge } from '../store/slices/challengeSlice';

const steps = [
  'Problem Definition',
  'Audience Requirements',
  'Submission Requirements',
  'Prize Configuration',
  'Timeline Setup',
  'Evaluation Criteria',
  'Review & Launch'
];

const CreateChallenge = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.challenges);

  const [activeStep, setActiveStep] = useState(0);
  const [challengeData, setChallengeData] = useState({
    title: '',
    problemStatement: '',
    goals: [],
    challengeType: '',
    audience: {
      geographicConstraints: [],
      languages: [],
      teamsAllowed: true,
      maxTeamSize: 5
    },
    communication: {
      forumEnabled: true,
      questionBoardEnabled: true
    },
    submission: {
      format: '',
      requirements: []
    },
    prizes: {
      structure: 'single',
      amounts: [],
      totalPrize: 0
    },
    timeline: {
      startDate: null,
      endDate: null,
      milestones: []
    },
    evaluation: {
      model: 'post-submission',
      reviewers: [],
      criteria: [],
      rubric: {
        useAIReview: false,
        usePeerReview: false,
        scoringSystem: 'points'
      }
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormUpdate = (formData) => {
    setChallengeData((prevData) => ({
      ...prevData,
      ...formData
    }));
  };

  const handleSubmit = async () => {
    const result = await dispatch(createChallenge(challengeData));
    if (!result.error) {
      navigate('/challenges/' + result.payload._id);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <IntakeForm
            data={challengeData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <AudienceForm
            data={challengeData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <SubmissionForm
            data={challengeData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PrizeForm
            data={challengeData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <TimelineForm
            data={challengeData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <EvaluationForm
            data={challengeData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <ReviewForm
            data={challengeData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Challenge
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>
      </Box>
    </Container>
  );
};

export default CreateChallenge;