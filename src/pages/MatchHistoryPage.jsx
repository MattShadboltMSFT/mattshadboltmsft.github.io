import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllMatches, deleteMatch } from '../services/matchService';
import { exportToPDF, exportToCSV } from '../services/exportService';
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
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';

export default function MatchHistoryPage() {
  const { player } = useApp();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportAnchor, setExportAnchor] = useState(null);

  useEffect(() => {
    async function loadMatches() {
      if (!player) return;
      
      try {
        const allMatches = await getAllMatches(player.id);
        setMatches(allMatches);
        setFilteredMatches(allMatches);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [player]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = matches.filter(match =>
        match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMatches(filtered);
    } else {
      setFilteredMatches(matches);
    }
  }, [searchTerm, matches]);

  const handleDelete = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match? This cannot be undone.')) {
      try {
        await deleteMatch(matchId);
        setMatches(matches.filter(m => m.id !== matchId));
      } catch (error) {
        alert('Failed to delete match: ' + error.message);
      }
    }
  };

  const handleExportPDF = () => {
    exportToPDF(matches, player);
    setExportAnchor(null);
  };

  const handleExportCSV = () => {
    exportToCSV(matches, player);
    setExportAnchor(null);
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
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: 'white' }}
          >
            ← Home
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Match History
          </Typography>
          <Button
            component={RouterLink}
            to="/match/new"
            variant="contained"
            color="secondary"
            size="small"
            sx={{ mr: 1 }}
          >
            ➕ New
          </Button>
          <Typography variant="body2">📋</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Search and Export */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search matches by opponent, venue, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
          />
          {matches.length > 0 && (
            <>
              <Button
                variant="outlined"
                onClick={(e) => setExportAnchor(e.currentTarget)}
                sx={{ minWidth: 120 }}
              >
                📥 Export
              </Button>
              <Menu
                anchorEl={exportAnchor}
                open={Boolean(exportAnchor)}
                onClose={() => setExportAnchor(null)}
              >
                <MenuItem onClick={handleExportPDF}>Export as PDF</MenuItem>
                <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <Fade in={true}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchTerm ? 'No matches found' : 'No matches recorded yet'}
                </Typography>
                {!searchTerm && (
                  <Button
                    component={RouterLink}
                    to="/match/new"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Add Your First Match
                  </Button>
                )}
              </CardContent>
            </Card>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {filteredMatches.map((match, index) => (
              <Grid item xs={12} key={match.id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                              vs {match.opponent}
                            </Typography>
                            {match.isTestData && (
                              <Chip label="Test Data" size="small" color="warning" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(match.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                          {match.venue && (
                            <Typography variant="body2" color="text.secondary">
                              {match.venue}
                            </Typography>
                          )}
                          {match.position && (
                            <Chip 
                              label={match.position} 
                              size="small" 
                              sx={{ mt: 1 }} 
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        <Chip
                          label={match.result}
                          color={
                            match.result === 'Win' ? 'success' :
                            match.result === 'Loss' ? 'error' :
                            match.result === 'Draw' ? 'info' : 'default'
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      {/* Stats Summary */}
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        {[
                          { label: 'Goals', value: match.stats.goals, color: 'success.main' },
                          { label: 'Kicks', value: match.stats.kicks, color: 'primary.main' },
                          { label: 'Marks', value: match.stats.marks, color: 'secondary.main' },
                          { label: 'Tackles', value: match.stats.tackles, color: 'info.main' }
                        ].map((stat) => (
                          <Grid item xs={3} key={stat.label}>
                            <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default' }}>
                              <Typography variant="h6" fontWeight={700} sx={{ color: stat.color }}>
                                {stat.value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {stat.label}
                              </Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      <Divider sx={{ my: 2 }} />

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          component={RouterLink}
                          to={`/match/${match.id}/view`}
                          variant="outlined"
                          fullWidth
                          size="small"
                        >
                          👁️ View Details
                        </Button>
                        {!match.isTestData && (
                          <>
                            <Button
                              component={RouterLink}
                              to={`/match/${match.id}`}
                              variant="contained"
                              fullWidth
                              size="small"
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(match.id)}
                              variant="outlined"
                              color="error"
                              fullWidth
                              size="small"
                            >
                              🗑️ Delete
                            </Button>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Summary */}
        {filteredMatches.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredMatches.length} of {matches.length} matches
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
