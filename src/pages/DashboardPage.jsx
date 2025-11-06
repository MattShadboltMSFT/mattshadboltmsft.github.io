import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { getSeasonStats } from '../services/matchService';
import { exportToCSV, exportToPDF } from '../services/exportService';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Fade,
  AppBar,
  Toolbar,
  Chip,
  Divider
} from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { player } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!player) return;
      
      try {
        const seasonStats = await getSeasonStats(player.id, player.season);
        setStats(seasonStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [player]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!stats || stats.totalGames === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Button onClick={() => navigate('/')} sx={{ mr: 2, color: 'white' }}>
              ← Home
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Typography variant="body2">📊</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No matches to display
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Prepare chart data
  const matches = stats.matches.slice().reverse(); // Chronological order
  
  const performanceTrendData = {
    labels: matches.map((m, index) => `Match ${index + 1}`),
    datasets: [
      {
        label: 'Goals',
        data: matches.map(m => m.stats.goals),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Kicks',
        data: matches.map(m => m.stats.kicks),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Marks',
        data: matches.map(m => m.stats.marks),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const averageStatsData = {
    labels: ['Kicks', 'Handballs', 'Marks', 'Tackles', 'Goals'],
    datasets: [
      {
        label: 'Season Average',
        data: [
          parseFloat(stats.averages.kicks),
          parseFloat(stats.averages.handballs),
          parseFloat(stats.averages.marks),
          parseFloat(stats.averages.tackles),
          parseFloat(stats.averages.goals),
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(stats.matches, player);
    } catch (error) {
      alert('Failed to export CSV: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(stats.matches, player, stats);
    } catch (error) {
      alert('Failed to export PDF: ' + error.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button onClick={() => navigate('/')} sx={{ mr: 2, color: 'white' }}>
            ← Home
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button onClick={handleExportCSV} color="inherit" size="small" sx={{ mr: 1 }}>
            📥 CSV
          </Button>
          <Button onClick={handleExportPDF} color="inherit" size="small">
            📄 PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Season Overview */}
        <Fade in={true} timeout={600}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Season {player.season}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {player.teamName}
                  </Typography>
                </Box>
                <Chip
                  label={`${stats.totalGames} Matches`}
                  color="primary"
                  sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
                />
              </Box>

              <Grid container spacing={3}>
                {[
                  { label: 'Total Goals', value: stats.stats.goals, icon: '⚽', color: 'success.main' },
                  { label: 'Total Kicks', value: stats.stats.kicks, icon: '🦵', color: 'primary.main' },
                  { label: 'Total Marks', value: stats.stats.marks, icon: '🙌', color: 'secondary.main' },
                  { label: 'Total Tackles', value: stats.stats.tackles, icon: '💪', color: 'info.main' },
                ].map((stat) => (
                  <Grid item xs={6} sm={3} key={stat.label}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h3" sx={{ mb: 1 }}>{stat.icon}</Typography>
                      <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Performance Trend */}
          <Grid item xs={12}>
            <Fade in={true} timeout={800}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    📈 Performance Trends
                  </Typography>
                  <Box sx={{ height: 400, mt: 3 }}>
                    <Line data={performanceTrendData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Average Stats */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    📊 Season Averages
                  </Typography>
                  <Box sx={{ height: 350, mt: 3 }}>
                    <Bar data={averageStatsData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Personal Bests */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1200}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                    🏆 Personal Bests
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { label: 'Most Goals', value: stats.personalBests.goals, icon: '⚽' },
                      { label: 'Most Kicks', value: stats.personalBests.kicks, icon: '🦵' },
                      { label: 'Most Marks', value: stats.personalBests.marks, icon: '🙌' },
                      { label: 'Most Tackles', value: stats.personalBests.tackles, icon: '💪' },
                      { label: 'Most Handballs', value: stats.personalBests.handballs, icon: '✋' },
                    ].map((best) => (
                      <Box
                        key={best.label}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: 'background.default',
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h5">{best.icon}</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {best.label}
                          </Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={700} color="primary">
                          {best.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Per Game Averages Table */}
        <Fade in={true} timeout={1400}>
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                📋 Detailed Statistics
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Kicks', value: stats.averages.kicks },
                  { label: 'Handballs', value: stats.averages.handballs },
                  { label: 'Marks', value: stats.averages.marks },
                  { label: 'Tackles', value: stats.averages.tackles },
                  { label: 'Goals', value: stats.averages.goals },
                  { label: 'Behinds', value: stats.averages.behinds },
                  { label: 'Spoils', value: stats.averages.spoils },
                  { label: 'Smothers', value: stats.averages.smothers },
                  { label: 'Interceptions', value: stats.averages.interceptions },
                  { label: 'Frees For', value: stats.averages.freesFor },
                  { label: 'Frees Against', value: stats.averages.freesAgainst },
                ].map((stat) => (
                  <Grid item xs={6} sm={4} md={3} key={stat.label}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="primary">
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label} per game
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}
