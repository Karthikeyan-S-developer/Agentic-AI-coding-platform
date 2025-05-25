import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { getChallenges } from '../store/slices/challengeSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { challenges, loading, error } = useSelector(state => state.challenges);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getChallenges());
  }, [dispatch]);

  const handleViewChallenge = (challengeId) => {
    navigate(`/challenges/${challengeId}`);
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

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create-challenge')}
        >
          Create New Challenge
        </Button>
      </Box>

      <Grid container spacing={3}>
        {challenges.map(challenge => (
          <Grid item xs={12} sm={6} md={4} key={challenge._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {challenge.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {challenge.description.length > 150
                    ? `${challenge.description.substring(0, 150)}...`
                    : challenge.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Prize Pool: ${challenge.prizeAmount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Submissions: {challenge.submissions?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {challenge.status}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleViewChallenge(challenge._id)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {challenges.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No challenges found. Create your first challenge!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;