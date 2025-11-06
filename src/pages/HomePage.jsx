import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSeasonStats, getAllMatches } from '../services/matchService';
import { hasTestData, loadTestData, clearAllTestData } from '../services/testDataService';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Fade,
  Divider
} from '@mui/material';

export default function HomePage() {
  const { player } = useApp();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [testDataLoaded, setTestDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!player) return;
      
      try {
        const seasonStats = await getSeasonStats(player.id, player.season);
        setStats(seasonStats);
        
        const matches = await getAllMatches(player.id);
        setRecentMatches(matches.slice(0, 3));
        
        const hasTest = await hasTestData();
        setTestDataLoaded(hasTest);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [player]);

  const handleLoadTestData = async () => {
    try {
      const count = await loadTestData(player.id);
      alert(`Loaded ${count} test matches successfully!`);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearTestData = async () => {
    if (window.confirm('Are you sure you want to clear all test data? This cannot be undone.')) {
      try {
        const count = await clearAllTestData();
        alert(`Cleared ${count} test matches successfully!`);
        window.location.reload();
      } catch (error) {
        alert('Failed to clear test data: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          mb: 4,
          boxShadow: 3
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h1" sx={{ fontSize: '3rem' }}>⚽</Typography>
            <Box>
              <Typography variant="h3" fontWeight={700}>
                Jay's Footy Stats
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {player?.teamName} • Season {player?.season}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Hero Section - Add New Match */}
        <Fade in={true} timeout={600}>
          <Button
            component={RouterLink}
            to="/match/new"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 3,
              fontSize: '1.25rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mb: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            ➕ Add New Match
          </Button>
        </Fade>

        {/* Test Data Controls */}
        {testDataLoaded && (
          <Fade in={true}>
            <Alert 
              severity="warning" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleClearTestData}>
                  Clear
                </Button>
              }
            >
              <Typography variant="body2" fontWeight={600}>Test Data Loaded</Typography>
              <Typography variant="caption">
                You are viewing test data from the 2025 fixture. Real matches are not affected.
              </Typography>
            </Alert>
          </Fade>
        )}

        {!testDataLoaded && stats?.totalGames === 0 && (
          <Fade in={true}>
            <Alert 
              severity="info" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleLoadTestData}>
                  Load
                </Button>
              }
            >
              <Typography variant="body2" fontWeight={600}>No Matches Yet</Typography>
              <Typography variant="caption">
                Load test data to see how the dashboard looks with sample matches, or add a real match.
              </Typography>
            </Alert>
          </Fade>
        )}

        {/* Season Summary */}
        {stats && stats.totalGames > 0 && (
          <Fade in={true} timeout={800}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  Season Summary
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Games Played
                  </Typography>
                  <Typography variant="h2" color="primary" fontWeight={700}>
                    {stats.totalGames}
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Card sx={{ bgcolor: 'success.light', textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" fontWeight={700} color="success.dark">
                        {stats.stats.goals}
                      </Typography>
                      <Typography variant="body2" color="success.dark">
                        Goals
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ bgcolor: 'info.light', textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" fontWeight={700} color="info.dark">
                        {stats.stats.kicks}
                      </Typography>
                      <Typography variant="body2" color="info.dark">
                        Kicks
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ bgcolor: 'secondary.light', textAlign: 'center', p: 2 }}>
                      <Typography variant="h3" fontWeight={700} color="secondary.dark">
                        {stats.stats.marks}
                      </Typography>
                      <Typography variant="body2" color="secondary.dark">
                        Marks
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                  Per Game Averages
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { label: 'Kicks', value: stats.averages.kicks },
                    { label: 'Handballs', value: stats.averages.handballs },
                    { label: 'Tackles', value: stats.averages.tackles },
                    { label: 'Marks', value: stats.averages.marks }
                  ].map((stat) => (
                    <Grid item xs={3} key={stat.label}>
                      <Box sx={{ textAlign: 'center', bgcolor: 'background.default', borderRadius: 2, p: 1.5 }}>
                        <Typography variant="h6" fontWeight={700}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  component={RouterLink}
                  to="/dashboard"
                  fullWidth
                  sx={{ mt: 3 }}
                  endIcon="📊"
                >
                  View Full Dashboard
                </Button>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <Fade in={true} timeout={1000}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  Recent Matches
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {recentMatches.map((match) => (
                    <Card
                      key={match.id}
                      component={RouterLink}
                      to={`/match/${match.id}/view`}
                      sx={{
                        mb: 2,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          boxShadow: 4,
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              vs {match.opponent}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(match.date).toLocaleDateString()} • {match.venue}
                            </Typography>
                            {match.isTestData && (
                              <Chip 
                                label="Test Data" 
                                size="small" 
                                color="warning" 
                                sx={{ mt: 1 }} 
                              />
                            )}
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" fontWeight={700} color="success.main">
                              {match.stats.goals}G {match.stats.behinds}B
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {match.stats.kicks}K {match.stats.marks}M
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Button
                  component={RouterLink}
                  to="/history"
                  fullWidth
                  sx={{ mt: 2 }}
                  endIcon="→"
                >
                  View All Matches
                </Button>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Navigation Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card
              component={RouterLink}
              to="/dashboard"
              sx={{
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" sx={{ mb: 2 }}>📊</Typography>
                <Typography variant="h6" fontWeight={600}>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your analytics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              component={RouterLink}
              to="/history"
              sx={{
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" sx={{ mb: 2 }}>📋</Typography>
                <Typography variant="h6" fontWeight={600}>
                  Match History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse all matches
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
