import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { getMatch, deleteMatch } from '../services/matchService';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Fade,
  AppBar,
  Toolbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadMatch() {
      try {
        const matchData = await getMatch(parseInt(id));
        setMatch(matchData);
      } catch (error) {
        console.error('Failed to load match:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteMatch(parseInt(id));
      navigate('/history');
    } catch (error) {
      alert('Failed to delete match: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!match) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Match not found
        </Typography>
      </Box>
    );
  }

  const allStats = [
    { label: 'Kicks', value: match.stats.kicks, icon: '🦵' },
    { label: 'Handballs', value: match.stats.handballs, icon: '✋' },
    { label: 'Marks', value: match.stats.marks, icon: '🙌' },
    { label: 'Goals', value: match.stats.goals, icon: '⚽' },
    { label: 'Behinds', value: match.stats.behinds, icon: '🎯' },
    { label: 'Tackles', value: match.stats.tackles, icon: '💪' },
    { label: 'Spoils', value: match.stats.spoils, icon: '🛡️' },
    { label: 'Smothers', value: match.stats.smothers, icon: '🚫' },
    { label: 'Interceptions', value: match.stats.interceptions, icon: '✋' },
    { label: 'Frees For', value: match.stats.freesFor, icon: '✅' },
    { label: 'Frees Against', value: match.stats.freesAgainst, icon: '⚠️' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button
            onClick={() => navigate('/history')}
            sx={{ mr: 2, color: 'white' }}
          >
            ← Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Match Details
          </Typography>
          {!match.isTestData && (
            <Button
              component={RouterLink}
              to={`/match/${match.id}`}
              color="inherit"
              size="small"
            >
              ✏️ Edit
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Match Info Card */}
        <Fade in={true} timeout={600}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    vs {match.opponent}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {new Date(match.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  {match.venue && (
                    <Typography variant="body2" color="text.secondary">
                      📍 {match.venue}
                    </Typography>
                  )}
                  {match.isTestData && (
                    <Chip label="Test Data" color="warning" size="small" sx={{ mt: 2 }} />
                  )}
                </Box>
                <Chip
                  label={match.result}
                  color={
                    match.result === 'Win' ? 'success' :
                    match.result === 'Loss' ? 'error' :
                    match.result === 'Draw' ? 'info' : 'default'
                  }
                  sx={{ fontSize: '1rem', fontWeight: 700, py: 2.5, px: 2 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                {match.position && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Position
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {match.position}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Quarters Played
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {match.quartersPlayed} / 4
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Statistics */}
        <Fade in={true} timeout={800}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                Statistics
              </Typography>

              <Grid container spacing={2}>
                {allStats.map((stat) => (
                  <Grid item xs={6} sm={4} key={stat.label}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>{stat.icon}</Typography>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Key Metrics Summary */}
              <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} color="primary.dark" gutterBottom>
                  Key Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="primary.dark">
                      Total Disposals
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                      {match.stats.kicks + match.stats.handballs}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="primary.dark">
                      Total Score
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                      {match.stats.goals}G {match.stats.behinds}B ({match.stats.goals * 6 + match.stats.behinds} pts)
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Notes */}
        {match.notes && (
          <Fade in={true} timeout={1000}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {match.notes}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Actions */}
        {!match.isTestData && (
          <Fade in={true} timeout={1200}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to={`/match/${match.id}`}
                variant="contained"
                size="large"
                fullWidth
              >
                ✏️ Edit Match
              </Button>
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="outlined"
                color="error"
                size="large"
                fullWidth
              >
                🗑️ Delete Match
              </Button>
            </Box>
          </Fade>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Match?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this match? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
