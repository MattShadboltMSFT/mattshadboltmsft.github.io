import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createMatch, updateMatch, getMatch } from '../services/matchService';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Fade,
  AppBar,
  Toolbar
} from '@mui/material';

const StatCounter = ({ label, statName, value, onChange }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom align="center">
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
        <IconButton
          onClick={() => onChange(statName, -1)}
          sx={{
            bgcolor: 'error.light',
            color: 'error.dark',
            width: 48,
            height: 48,
            '&:hover': { bgcolor: 'error.main', color: 'white' },
            transition: 'all 0.2s'
          }}
        >
          <Typography variant="h5" fontWeight={700}>−</Typography>
        </IconButton>
        <Typography variant="h3" fontWeight={700} sx={{ minWidth: 60, textAlign: 'center' }}>
          {value}
        </Typography>
        <IconButton
          onClick={() => onChange(statName, 1)}
          sx={{
            bgcolor: 'success.light',
            color: 'success.dark',
            width: 48,
            height: 48,
            '&:hover': { bgcolor: 'success.main', color: 'white' },
            transition: 'all 0.2s'
          }}
        >
          <Typography variant="h5" fontWeight={700}>+</Typography>
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

export default function MatchEntryPage() {
  const { player, loading } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    venue: '',
    position: '',
    quartersPlayed: 4,
    result: 'Unknown',
    stats: {
      kicks: 0,
      handballs: 0,
      marks: 0,
      goals: 0,
      behinds: 0,
      tackles: 0,
      spoils: 0,
      smothers: 0,
      interceptions: 0,
      freesFor: 0,
      freesAgainst: 0,
    },
    notes: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      async function loadMatch() {
        const match = await getMatch(parseInt(id));
        if (match && match.date) {
          const matchDate = typeof match.date === 'string' ? match.date : new Date(match.date).toISOString();
          setFormData({
            date: matchDate.split('T')[0],
            opponent: match.opponent || '',
            venue: match.venue || '',
            position: match.position || '',
            quartersPlayed: match.quartersPlayed || 4,
            result: match.result || 'Unknown',
            stats: match.stats || {},
            notes: match.notes || '',
          });
        }
      }
      loadMatch();
    }
  }, [id, isEditing]);

  const updateStat = (statName, delta) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: Math.max(0, prev.stats[statName] + delta)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.opponent.trim()) {
      alert('Please enter opponent name');
      return;
    }

    if (!player || !player.id) {
      alert('Player data is not loaded. Please wait and try again.');
      return;
    }

    setSaving(true);
    try {
      const matchData = {
        ...formData,
        playerId: player.id,
        date: new Date(formData.date).toISOString(),
      };

      if (isEditing) {
        await updateMatch(parseInt(id), matchData);
      } else {
        await createMatch(matchData);
      }

      navigate('/history');
    } catch (error) {
      alert('Failed to save match: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !player) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button
            onClick={() => navigate(-1)}
            sx={{ mr: 2, color: 'white' }}
          >
            ← Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isEditing ? 'Edit Match' : 'Add New Match'}
          </Typography>
          <Typography variant="body2">⚽</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <Fade in={true} timeout={600}>
            <Box sx={{ mb: 3 }}>
              {/* Match Details */}
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                    Match Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Match Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Opponent"
                        value={formData.opponent}
                        onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                        placeholder="e.g., Hampton Rovers"
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        placeholder="e.g., President Park"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Position</InputLabel>
                        <Select
                          value={formData.position}
                          label="Position"
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        >
                          <MenuItem value="">Select position</MenuItem>
                          <MenuItem value="Forward">Forward</MenuItem>
                          <MenuItem value="Midfield">Midfield</MenuItem>
                          <MenuItem value="Defence">Defence</MenuItem>
                          <MenuItem value="Ruck">Ruck</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Quarters Played</InputLabel>
                        <Select
                          value={formData.quartersPlayed}
                          label="Quarters Played"
                          onChange={(e) => setFormData({ ...formData, quartersPlayed: parseInt(e.target.value) })}
                        >
                          <MenuItem value={1}>1 Quarter</MenuItem>
                          <MenuItem value={2}>2 Quarters</MenuItem>
                          <MenuItem value={3}>3 Quarters</MenuItem>
                          <MenuItem value={4}>4 Quarters</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Result</InputLabel>
                        <Select
                          value={formData.result}
                          label="Result"
                          onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                        >
                          <MenuItem value="Unknown">Unknown</MenuItem>
                          <MenuItem value="Win">Win</MenuItem>
                          <MenuItem value="Loss">Loss</MenuItem>
                          <MenuItem value="Draw">Draw</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Fade>

          {/* Statistics */}
          <Fade in={true} timeout={800}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                  Statistics
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StatCounter 
                      label="Kicks" 
                      statName="kicks" 
                      value={formData.stats.kicks}
                      onChange={updateStat}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatCounter 
                      label="Handballs" 
                      statName="handballs" 
                      value={formData.stats.handballs}
                      onChange={updateStat}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <StatCounter 
                      label="Marks" 
                      statName="marks" 
                      value={formData.stats.marks}
                      onChange={updateStat}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatCounter 
                      label="Tackles" 
                      statName="tackles" 
                      value={formData.stats.tackles}
                      onChange={updateStat}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <StatCounter 
                      label="Goals" 
                      statName="goals" 
                      value={formData.stats.goals}
                      onChange={updateStat}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatCounter 
                      label="Behinds" 
                      statName="behinds" 
                      value={formData.stats.behinds}
                      onChange={updateStat}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <StatCounter 
                      label="Spoils" 
                      statName="spoils" 
                      value={formData.stats.spoils}
                      onChange={updateStat}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StatCounter 
                      label="Smothers" 
                      statName="smothers" 
                      value={formData.stats.smothers}
                      onChange={updateStat}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StatCounter 
                      label="Intercepts" 
                      statName="interceptions" 
                      value={formData.stats.interceptions}
                      onChange={updateStat}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <StatCounter 
                      label="Frees For" 
                      statName="freesFor" 
                      value={formData.stats.freesFor}
                      onChange={updateStat}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatCounter 
                      label="Frees Against" 
                      statName="freesAgainst" 
                      value={formData.stats.freesAgainst}
                      onChange={updateStat}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>

          {/* Notes */}
          <Fade in={true} timeout={1000}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
                  Notes (Optional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes about this match..."
                />
              </CardContent>
            </Card>
          </Fade>

          {/* Save Button */}
          <Box sx={{ position: 'sticky', bottom: 16 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={saving}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 6,
                }
              }}
            >
              {saving ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                  Saving...
                </>
              ) : (
                isEditing ? '✏️ Update Match' : '💾 Save Match'
              )}
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
